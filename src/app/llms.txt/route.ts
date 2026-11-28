import { platforms } from "@/components/platform-icons";
import { faq } from "@/lib/faq";
import { site } from "@/lib/site";
import { streamers } from "@/lib/streamers";

/** llms.txt: a plain-text summary of the site for AI assistants and answer engines. */
export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Sections",
    `- [How it works](${site.url}/#steps): set up once, Clippable clips every stream, then you post.`,
    `- [Streamer campaigns](${site.url}/#streamers): streamers you can clip and what they pay.`,
    `- [FAQ](${site.url}/#faq)`,
    `- [Sign up for the beta](${site.url}/signup): create an account for early access.`,
    `- [Terms of Service](${site.url}/terms)`,
    `- [Privacy Policy](${site.url}/privacy)`,
    "",
    "## Streamers",
    ...streamers.map(
      (s) =>
        `- ${s.name}${s.platform ? ` (${platforms[s.platform].title})` : ""}${s.rate ? `: ${s.rate}` : ""}`,
    ),
    "",
    "## FAQ",
    ...faq.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Contact",
    `- ${site.email}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
