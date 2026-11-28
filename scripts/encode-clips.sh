#!/usr/bin/env bash
# Encode the client's clips for the hero story.
#
# Usage:
#   scripts/encode-clips.sh <folder-with-8-clips> [hero-stream-video]
#
# - Clips: any 8 videos (vertical or landscape), used in alphabetical order.
#   Each is centre-cropped to 9:16, trimmed to 5s, and written as
#   public/media/clips/clip-N.{av1.mp4,h264.mp4,webp}.
# - Hero (optional): the landscape stream that gets cut into the clips,
#   written as public/media/hero.{av1.mp4,h264.mp4} + hero-poster.webp.
#
# Tweak a clip's start time with START_<N>=seconds (e.g. START_3=12).
set -euo pipefail
IN="${1:?folder with clips}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT/clips"
CROP="crop='min(iw,ih*9/16)':'min(ih,iw*16/9)':'(iw-min(iw,ih*9/16))/2':'(ih-min(ih,iw*16/9))/2',scale=540:960,fps=30"

i=0
while IFS= read -r f; do
  i=$((i + 1)); [ "$i" -gt 8 ] && break
  var="START_$i"; ss="${!var:-0}"
  echo "clip $i ← $(basename "$f") (start ${ss}s)"
  ffmpeg -nostdin -v error -y -ss "$ss" -t 5 -i "$f" -an -vf "$CROP" -c:v libsvtav1 -crf 42 -preset 5 -pix_fmt yuv420p -movflags +faststart "$OUT/clips/clip-$i.av1.mp4"
  ffmpeg -nostdin -v error -y -ss "$ss" -t 5 -i "$f" -an -vf "$CROP" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/clips/clip-$i.h264.mp4"
  # Phone set (tiles render ~100px wide on phones)
  ffmpeg -nostdin -v error -y -i "$OUT/clips/clip-$i.h264.mp4" -an -vf scale=270:480 -c:v libsvtav1 -crf 40 -preset 5 -pix_fmt yuv420p -movflags +faststart "$OUT/clips/clip-$i.m.av1.mp4"
  ffmpeg -nostdin -v error -y -i "$OUT/clips/clip-$i.h264.mp4" -an -vf scale=270:480 -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/clips/clip-$i.m.h264.mp4"
  ffmpeg -nostdin -v error -y -ss "$ss" -i "$f" -frames:v 1 -vf "$CROP,scale=360:640" -c:v libwebp -quality 70 "$OUT/clips/clip-$i.webp"
done < <(find "$IN" -maxdepth 1 -type f \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' -o -iname '*.mkv' \) | sort)
if [ "$i" -lt 8 ]; then echo "warning: only $i clips found; the story expects 8" >&2; fi

if [ -n "${2:-}" ]; then
  # Hero: muted, 24fps, 10-bit AV1 + H.264 fallback, desktop 960x540 and phone 640x360.
  echo "hero ← $(basename "$2")"
  for spec in "960:540:" "640:360:.m"; do
    IFS=: read -r w h sfx <<<"$spec"
    V="scale=$w:$h:flags=lanczos,fps=24"
    ffmpeg -nostdin -v error -y -i "$2" -an -vf "$V" -c:v libsvtav1 -crf 46 -preset 4 -g 96 -svtav1-params tune=0 -pix_fmt yuv420p10le -movflags +faststart "$OUT/hero$sfx.av1.mp4"
    ffmpeg -nostdin -v error -y -i "$2" -an -vf "$V" -c:v libx264 -crf 29 -preset veryslow -tune film -g 96 -pix_fmt yuv420p -movflags +faststart "$OUT/hero$sfx.h264.mp4"
  done
  ffmpeg -nostdin -v error -y -ss 0.5 -i "$2" -frames:v 1 -vf "scale=960:540" -c:v libwebp -quality 70 "$OUT/hero-poster.webp"
fi
echo "done → $OUT"
