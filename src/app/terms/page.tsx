import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using Clippable: accounts, clipping campaigns, payouts per 1,000 views, content rights, AI features and how disputes are handled.",
  alternates: { canonical: "/terms" },
};

const L = site.legal;
const mail = (to: string, subject: string) => (
  <a href={`mailto:${to}?subject=${encodeURIComponent(subject)}`}>{to}</a>
);

/*
 * Drafted from current best practice for creator-reward marketplaces and AI clip tools.
 * TODO(client): have counsel review before public launch, especially payouts, disputes and governing law.
 */
const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "The agreement",
    summary:
      "By using Clippable you agree to these Terms. Each campaign's rules, shown in the product, add the details for that campaign.",
    body: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and {L.entity}{" "}
          (&ldquo;Clippable&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). They cover clippable.net,
          our web app, our API and agent connectors, and everything we offer through them (together,
          the &ldquo;Service&rdquo;).
        </p>
        <p>
          These Terms and the rules of any campaign you join or run, as shown in the Service
          (&ldquo;Campaign Rules&rdquo;), form the agreement between you and us. Campaign Rules
          control only for that campaign&rsquo;s eligibility, content requirements, rates, budget,
          tracking window and the licence scope for approved clips; they cannot change our
          disclaimers, limitation of liability, indemnity, dispute resolution or governing law
          terms, or create obligations for Clippable. Otherwise these Terms control. Our{" "}
          <Link href="/privacy">Privacy Policy</Link> explains how we handle personal data. If you
          use the Service for a company, you confirm you can bind that company, and
          &ldquo;you&rdquo; means both of you.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use Clippable",
    summary: `You must be at least ${L.minAge} and able to form a binding contract. You can't use Clippable if you're barred by sanctions laws.`,
    body: (
      <>
        <p>
          You must be at least {L.minAge} years old (or the age of majority where you live, if
          higher) to create an account, join or fund a campaign, or receive payouts. You must not be
          located in, or a resident of, a country subject to comprehensive U.S. sanctions, and you
          must not appear on any U.S. or other government restricted-party list.
        </p>
        <p>
          We may refuse service, or ask you to verify your identity, where the law requires it or
          where we reasonably suspect fraud.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    summary:
      "Sign in with Google, Instagram, TikTok or email, keep your details accurate and your account secure. You're responsible for what happens in it, including actions by AI agents you connect.",
    body: (
      <>
        <p>
          You can sign up with Google, Instagram, TikTok or your email address. Give us accurate
          information and keep it up to date. One person may hold one account unless we approve
          otherwise in writing.
        </p>
        <p>
          Keep your sign-in methods, API keys and connected accounts secure, and tell us at{" "}
          {mail(site.email, "Account security")} if you think your account has been compromised. You
          are responsible for all activity under your account, including actions taken by AI agents
          or tools you connect to it.
        </p>
      </>
    ),
  },
  {
    id: "beta",
    title: "Private beta",
    summary:
      "Clippable is in beta. Features, rates and availability can change, and things may break. Feedback you send us can be used freely.",
    body: (
      <>
        <p>
          The Service is currently offered as a private beta. Features may be added, changed or
          removed, campaign availability and rates may change, and the Service may contain bugs or
          be unavailable at times. We do not offer an uptime commitment during the beta.
        </p>
        <p>
          If you send us ideas or feedback, you agree we may use them without restriction or payment
          to you.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "What Clippable does",
    summary:
      "Clippable turns livestreams you're allowed to clip into vertical clips, applies branding and runs campaigns that pay clippers per 1,000 verified views.",
    body: (
      <>
        <p>
          Clippable processes Kick and Twitch livestreams that you own, that belong to a campaign
          you have joined, or that you are otherwise authorised to clip. It finds moments and cuts
          them into vertical clips with captions and branding. You can save repeatable workflows,
          connect AI agents to run them, and download or post clips to platforms such as TikTok,
          YouTube Shorts, Instagram Reels and X.
        </p>
        <p>
          Streamers and brands (&ldquo;Campaign Owners&rdquo;) can fund campaigns. Clippers who post
          eligible clips for a campaign earn a rate per 1,000 verified views, as set out in that
          campaign&rsquo;s rules. Clippable is a platform connecting the two; we are not a party to
          the posts you make and we do not guarantee views, earnings or campaign availability.
        </p>
      </>
    ),
  },
  {
    id: "clippers",
    title: "Rules for clippers",
    summary:
      "Clip only what you're allowed to, follow each campaign's written rules, disclose paid content clearly, and never fake views.",
    body: (
      <>
        <p>If you clip or post through Clippable, you agree to:</p>
        <ul>
          <li>
            Only clip streams that you own, that belong to a campaign you have joined, or that the
            rights holder has allowed you to clip. Outside a campaign, you alone are responsible for
            having the rights to what you clip and post.
          </li>
          <li>
            Post only to social accounts you own or control, and follow each platform&rsquo;s own
            terms and branded-content rules.
          </li>
          <li>
            Follow the campaign&rsquo;s requirements as written in the Service. Instructions given
            anywhere else (for example by direct message or email) are not part of the campaign
            unless they are added to its rules.
          </li>
          <li>
            <strong>Disclose paid content.</strong> Where a campaign pays you, make that clear and
            conspicuous in each post, as required by the FTC Endorsement Guides and similar rules
            elsewhere: use the platform&rsquo;s paid-partnership label where one exists, and
            otherwise a clear disclosure such as #ad at the start of the caption, not hidden after
            &ldquo;more&rdquo; or among other hashtags. For video, also include the disclosure in
            the clip itself (on screen and, where practical, spoken) where the campaign or platform
            requires it. Posts without a required disclosure are not eligible for payment.
          </li>
          <li>
            <strong>Earn only real views.</strong> You must not use bots, purchased or incentivised
            views, engagement pods, view farms, multiple accounts or any other method to inflate
            views or engagement.
          </li>
          <li>
            Not repost the same clip across several accounts, or reuse a clip across campaigns,
            unless the campaign allows it.
          </li>
          <li>
            Keep posts live for any minimum period the campaign sets, and remove them if a Campaign
            Owner or Clippable asks you to for a legal or rights reason.
          </li>
        </ul>
        <p>
          You take part as an independent contractor. Nothing in these Terms makes you an employee,
          agent or partner of Clippable or of any Campaign Owner.
        </p>
      </>
    ),
  },
  {
    id: "campaigns",
    title: "Rules for streamers and brands",
    summary:
      "Campaigns are funded upfront. You set the rate per 1,000 views and the rules, and you're responsible for your content, your ad claims and honest disclosures.",
    body: (
      <>
        <p>If you run a campaign, you agree that:</p>
        <ul>
          <li>
            <strong>Funding.</strong> Campaigns are funded before they go live. The budget is drawn
            down as clippers earn, at the rate per 1,000 verified views you set, up to any per-clip
            or per-campaign limits you choose. Platform and payment-processing fees are shown before
            you fund. Campaign funds are collected and held by our payment processor, not by
            Clippable as a bank. You appoint Clippable as your limited agent to collect funds and
            pay clippers on your behalf, and payment to Clippable or its processor satisfies your
            obligation to pay the clippers who earn from your campaign. If a payment you made is
            reversed or charged back, you remain responsible for amounts clippers earned before the
            reversal, plus related fees.
          </li>
          <li>
            <strong>Review.</strong> If your campaign requires approval, you will review submissions
            within the window shown in the Service; submissions not reviewed in time may be approved
            automatically. Once approved, a submission cannot later be rejected by you. Clippable
            may still withhold, reverse or recover earnings as described in{" "}
            <a href="#payouts">Views, payouts and taxes</a>.
          </li>
          <li>
            <strong>Unused budget.</strong> When a campaign ends, unused budget is returned to your
            Clippable balance, or refunded to your original payment method on request, less any
            non-refundable processing fees shown when you funded. Balances inactive for 24 months
            may be refunded to you or handled as unclaimed property law requires.
          </li>
          <li>
            <strong>Your content and claims.</strong> You are responsible for the stream content you
            make available and for any claims about products or offers in your campaign, and you
            will provide substantiation for any objective claims you ask clippers to make. Campaigns
            for regulated categories (for example gambling, alcohol, financial products or political
            content) need our prior approval and must follow applicable law.
          </li>
          <li>
            <strong>Disclosures.</strong> You will not ask clippers to hide or weaken disclosures,
            and you agree that Clippable may monitor posts and remove non-compliant ones from your
            campaign.
          </li>
          <li>
            <strong>No circumvention.</strong> While a campaign runs and for 12 months after, you
            will not pay clippers you met through Clippable for the same campaign work outside the
            Service.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payouts",
    title: "Views, payouts and taxes",
    summary:
      "Only verified views count. Earnings may be held for review and can be reversed for fraud. Payouts run through Stripe. You're responsible for your own taxes.",
    body: (
      <>
        <h3>Verified views</h3>
        <p>
          A view counts only if we can verify it from the platform&rsquo;s own data (for example via
          its API) within the campaign&rsquo;s tracking window. We use automated signals to detect
          artificial views, and they may place earnings on a temporary hold. A person reviews any
          decision to withhold or reverse earnings for suspected fraud. You can ask for an
          explanation and appeal by contacting us within 30 days of the decision.
        </p>
        <h3>Holds and reversals</h3>
        <p>
          Earnings may be held for a review period shown in the Service before they become
          available. We may withhold, reverse or recover earnings that resulted from fraud, a breach
          of these Terms or Campaign Rules, a post that was removed for infringement, or an error in
          our calculations.
        </p>
        <h3>Payouts</h3>
        <p>
          Payment processing services for clippers and Campaign Owners on Clippable are provided by{" "}
          {L.payoutProcessor} and are subject to the{" "}
          <a
            href="https://stripe.com/connect-account/legal"
            rel="noopener noreferrer"
            target="_blank"
          >
            Stripe Connected Account Agreement
          </a>
          , which includes the{" "}
          <a href="https://stripe.com/legal" rel="noopener noreferrer" target="_blank">
            Stripe Terms of Service
          </a>{" "}
          (together, the &ldquo;Stripe Services Agreement&rdquo;). By agreeing to these Terms or
          continuing to receive payouts through Clippable, you agree to be bound by the Stripe
          Services Agreement, as Stripe may modify it from time to time. As a condition of Clippable
          enabling payment processing services through Stripe, you agree to provide Clippable
          accurate and complete information about you and your business, and you authorise Clippable
          to share it, and transaction information related to your use of those services, with
          Stripe.
        </p>
        <p>
          You may need to complete identity checks to receive payouts. Minimum payout amounts,
          currencies and timing are shown in the Service. Balances are not bank deposits and do not
          earn interest.
        </p>
        <h3>Taxes</h3>
        <p>
          You are responsible for taxes on what you earn or spend. We may ask for tax information
          (such as a Form W-9 or W-8) and may issue tax forms such as a 1099 where the law requires;
          we may withhold payouts until required tax information is provided.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Content and licences",
    summary:
      "You keep ownership of your content. You give Clippable the rights we need to run the service, and approved campaign clips can be used by the Campaign Owner.",
    body: (
      <>
        <h3>Stream content</h3>
        <p>
          Streamers keep all rights in their streams. By connecting a stream or running a campaign,
          you grant Clippable and clippers taking part a non-exclusive, worldwide, royalty-free
          licence to capture, clip, edit, caption, brand and post that content for your campaigns
          and for providing the Service. You confirm you have the rights needed to grant this,
          including for music, game footage and anyone appearing in your stream.
        </p>
        <h3>Your clips and uploads</h3>
        <p>
          You keep ownership of clips you create and content you upload. You grant Clippable a
          non-exclusive, worldwide, royalty-free licence to host, process, display and transmit that
          content to provide and secure the Service. For clips approved or paid in a campaign, you
          also grant the Campaign Owner, to the extent of your rights (including any voice or
          likeness you add), a perpetual, worldwide, royalty-free, non-exclusive licence to use,
          repost and adapt them, including in paid promotion, unless the Campaign Rules say
          otherwise.
        </p>
        <h3>Name and likeness</h3>
        <p>
          Streamers allow Clippable to use their name, handle and likeness to show and promote their
          campaigns on the Service.
        </p>
        <h3>Clippable&rsquo;s property</h3>
        <p>
          The Service, including our software, brand templates, designs and trademarks, belongs to
          Clippable. We give you a limited, revocable right to use it under these Terms.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI features and agents",
    summary:
      "AI helps pick moments and write captions, but it can be wrong. Review before you post. Agents you connect act for you.",
    body: (
      <>
        <p>
          Clippable uses AI to find moments, transcribe speech and suggest captions. AI output can
          be inaccurate, incomplete or out of context. Review clips and captions before posting; you
          are responsible for what you publish.
        </p>
        <p>
          If you connect an AI agent or tool (for example Claude or ChatGPT) to your account, it
          acts on your instructions and with your permissions, and you are responsible for its
          actions. We apply rate limits and may suspend connections that put the Service at risk.
        </p>
        <p>
          We do not use your streams, clips or uploads to train general-purpose AI models. Some
          features use third-party AI providers, which process data on our behalf as described in
          our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "platforms",
    title: "Third-party platforms",
    summary:
      "Kick, Twitch, TikTok, YouTube, Instagram and X have their own rules, which you must follow. We're not affiliated with them.",
    body: (
      <>
        <p>
          The Service works with platforms we don&rsquo;t control, including Kick, Twitch, TikTok,
          YouTube, Instagram and X. Your use of them is governed by their terms and policies (for
          YouTube, the{" "}
          <a href="https://www.youtube.com/t/terms" rel="noopener noreferrer" target="_blank">
            YouTube Terms of Service
          </a>
          ). Clippable is not affiliated with, endorsed or sponsored by any of them.
        </p>
        <p>
          These platforms can change or withdraw their services and APIs at any time, which may
          affect clipping, posting, view tracking or earnings. We are not responsible for those
          changes.
        </p>
      </>
    ),
  },
  {
    id: "conduct",
    title: "What you can't do",
    summary:
      "No illegal, infringing or harmful content, no deceptive edits, no abuse of the service.",
    body: (
      <>
        <p>You must not use the Service to:</p>
        <ul>
          <li>
            Post or create content that is illegal, infringing, hateful, harassing or sexually
            explicit.
          </li>
          <li>
            Create or share any content that sexualises minors. We report child sexual abuse
            material to the National Center for Missing &amp; Exploited Children.
          </li>
          <li>
            Make deceptive edits, deepfakes or out-of-context clips that misrepresent what a
            streamer said or did, or share intimate images without consent.
          </li>
          <li>
            Scrape, reverse engineer, overload or interfere with the Service, or get around rate
            limits or security measures.
          </li>
          <li>
            Create multiple accounts to farm campaigns, or pay or get paid outside the Service to
            avoid fees.
          </li>
          <li>Break any law or anyone else&rsquo;s rights.</li>
        </ul>
      </>
    ),
  },
  {
    id: "copyright",
    title: "Copyright complaints",
    summary:
      "If you think something on Clippable infringes your copyright, tell us and we'll act on it. Repeat infringers lose their accounts.",
    body: (
      <>
        <p>
          We respond to notices of alleged copyright infringement under the U.S. Digital Millennium
          Copyright Act. Send notices to our designated agent at{" "}
          {mail(L.copyrightEmail, "Copyright notice")}
          {L.address ? ` (${L.entity}, Attn: Copyright Agent, ${L.address})` : ""} with: your
          contact details; the work you believe is infringed; where the material is on the Service;
          a statement that you believe in good faith the use is not authorised; a statement, under
          penalty of perjury, that your notice is accurate and you are authorised to act; and your
          physical or electronic signature.
        </p>
        <p>
          If your content was removed and you believe that was a mistake or misidentification, you
          may send a counter-notice to the same address. It must include your physical or electronic
          signature; identification of the material and where it appeared before removal; a
          statement under penalty of perjury that you have a good-faith belief the material was
          removed by mistake or misidentification; your name, address and phone number; and a
          statement that you consent to the jurisdiction of the federal court for your district (or,
          if you are outside the U.S., any district where Clippable may be found) and will accept
          service from the person who sent the original notice. We may restore the material 10 to 14
          business days after we receive a valid counter-notice, unless the complainant tells us
          they have filed a court action. Knowingly false notices or counter-notices can create
          liability under 17 U.S.C. &sect; 512(f). We terminate the accounts of repeat infringers in
          appropriate circumstances.
        </p>
      </>
    ),
  },
  {
    id: "moderation",
    title: "Reporting illegal content",
    summary:
      "Anyone can report content they think is illegal. We review reports, tell you why if we act on your content, and you can appeal.",
    body: (
      <p>
        Anyone can report content they believe is illegal, or breaks these Terms, by emailing{" "}
        {mail(L.copyrightEmail, "Content report")}. Include where the content is, why you believe it
        is illegal, and your name and email (optional for reports of child sexual abuse). We review
        reports diligently and may use automated tools to detect fraud and policy breaches, with
        human review of decisions that restrict accounts or payouts. If we remove your content,
        restrict your account or withhold earnings, we will tell you the reasons and how to appeal,
        unless the law prevents us. Users in the EU may appeal within 6 months through the same
        address and may also use a certified out-of-court dispute settlement body. Our single point
        of contact for authorities and users under the EU Digital Services Act is{" "}
        {mail(site.email, "DSA contact")}; we accept communications in English.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    summary:
      "You can leave any time. We can suspend or close accounts that break these Terms. Verified earnings are paid out unless they are withheld or reversed under our payout rules.",
    body: (
      <>
        <p>
          You can stop using the Service and delete your account at any time. We may suspend or end
          your access if you break these Terms or Campaign Rules, if we must for legal reasons, or
          if your use creates risk for Clippable or others. Where reasonable, we will tell you why
          and give you a chance to respond.
        </p>
        <p>
          If your account is closed, verified earnings that are not subject to a fraud investigation
          or reversal will be paid out, and unused campaign budget will be handled as described in{" "}
          <a href="#campaigns">Rules for streamers and brands</a>. Sections that by their nature
          should survive (including licences already granted, payment obligations, disclaimers,
          liability limits and dispute terms) continue after termination.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    summary: "The service is provided as it is. We don't promise views, earnings or uptime.",
    body: (
      <p>
        To the fullest extent the law allows, the Service is provided &ldquo;as is&rdquo; and
        &ldquo;as available&rdquo;, without warranties of any kind, express or implied, including
        merchantability, fitness for a particular purpose and non-infringement. We do not warrant
        that the Service will be uninterrupted or error-free, or that you will get any particular
        number of views or amount of earnings. Rates shown on our website are examples.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    summary:
      "If something goes wrong, our liability is capped, except for money we owe you. This doesn't limit rights the law says can't be limited.",
    body: (
      <>
        <p>
          To the fullest extent the law allows, Clippable will not be liable for indirect,
          incidental, special, consequential or punitive damages, or for lost profits, revenue, data
          or goodwill. Our total liability for any claim relating to the Service is limited to the
          greater of (a) the fees you paid to, or earnings you received from, Clippable in the 12
          months before the claim, and (b) US$100.
        </p>
        <p>
          This cap does not apply to our obligation to pay verified earnings due to you or to return
          unused campaign budget under these Terms. Nothing in these Terms limits liability that
          cannot be limited by law, such as for fraud, or for death or personal injury caused by
          negligence. Some jurisdictions do not allow the exclusion of certain warranties or the
          limitation of certain damages, so parts of this section and the Disclaimers may not apply
          to you. If you are a consumer in the EU or UK, we are liable for foreseeable loss caused
          by our breach of these Terms or our failure to use reasonable care and skill.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    summary:
      "If your content or conduct gets Clippable into a legal dispute, you'll cover the cost, to the extent the law allows.",
    body: (
      <p>
        To the extent permitted by law, you will defend and indemnify Clippable and its team against
        claims, losses and costs (including reasonable legal fees) arising from your content, your
        posts and disclosures, your campaigns and their claims, or your breach of these Terms or of
        law. We will promptly notify you of any claim, let you control its defence with counsel
        reasonably acceptable to us, and not settle a claim that imposes an obligation on you
        without your consent. For consumers, this applies only to claims caused by your content,
        conduct or breach.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Resolving disputes",
    summary:
      "Talk to us first. If we can't resolve it, US users agree to individual arbitration (you can opt out within 30 days). EU and UK consumers keep their local rights.",
    body: (
      <>
        <h3>Talk to us first</h3>
        <p>
          Before filing a claim, contact us at {mail(site.email, "Dispute")} with a description of
          the dispute. We will try to resolve it informally within 60 days. Limitation periods and
          filing deadlines are paused for these 60 days.
        </p>
        <h3>Arbitration (United States)</h3>
        <p>
          If you live in, or your business is based in, the United States, you and Clippable agree
          to resolve any dispute through final, binding, individual arbitration administered by the
          American Arbitration Association under its Consumer Arbitration Rules (or its Commercial
          Arbitration Rules for business users), rather than in court. Either of us may instead
          bring an individual claim in small claims court. You and Clippable waive any right to a
          jury trial or to take part in a class or representative action.
        </p>
        <p>
          This agreement is governed by the Federal Arbitration Act. The arbitrator decides all
          questions about the scope, enforceability and validity of this arbitration agreement,
          except that a court decides questions about the class and representative action waiver and
          the batch procedure below. We will pay the AAA filing, administration and arbitrator fees
          for any consumer claim, other than your share of the initial filing fee, which will not
          exceed the court filing fee where you live. Hearings may take place by video or in your
          home county. If 25 or more similar claims are filed by or with the help of the same law
          firm or group, the AAA will administer them in batches of up to 50 claims, one arbitrator
          per batch, and the claims&rsquo; limitation periods are paused while they wait. Either of
          us may bring claims about intellectual property infringement or misuse of the Service in
          court for injunctive relief. If the waiver of class or representative actions is found
          unenforceable for any claim, including a claim for public injunctive relief, that claim
          will be decided in court after the arbitration ends, and the rest of this section still
          applies.
        </p>
        <p>
          <strong>You can opt out</strong> of this arbitration agreement by emailing{" "}
          {mail(site.email, "Arbitration opt-out")} within 30 days of first accepting these Terms,
          with your name and the email on your account. If we make a material change to this
          section, you may reject it by emailing us within 30 days of the change taking effect, and
          the previous version will continue to apply to you.
        </p>
        <h3>EU, UK and other consumers</h3>
        <p>
          If you are a consumer living in the European Union, the United Kingdom or another country
          whose law does not allow it, the arbitration and class-waiver terms do not apply to you,
          and you may bring claims in the courts of where you live. Nothing in these Terms affects
          rights you have under mandatory consumer law.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    summary: `These Terms are governed by the laws of ${L.governingLaw}, subject to your local consumer rights.`,
    body: (
      <p>
        These Terms are governed by the laws of {L.governingLaw} and applicable U.S. federal law,
        without regard to conflict-of-law rules. Subject to the arbitration section, any court
        proceedings will be brought in the state or federal courts located in {L.governingLaw},
        except where your local consumer law gives you the right to use your home courts.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    summary: "If we make important changes, we'll tell you in advance.",
    body: (
      <p>
        We may update these Terms. For material changes we will give you at least 14 days&rsquo;
        notice by email or in the Service, unless a change is required by law or addresses security
        or abuse, in which case it may apply sooner. If you don&rsquo;t agree, you can close your
        account before the change takes effect; if you keep using the Service, you accept the new
        Terms. Changes do not apply to disputes already in progress (see also the opt-out right in{" "}
        <a href="#disputes">Resolving disputes</a>), and running campaigns keep the Campaign Rules
        they started with.
      </p>
    ),
  },
  {
    id: "general",
    title: "General",
    summary: "The usual legal housekeeping.",
    body: (
      <p>
        You may not transfer your rights under these Terms without our consent; we may transfer ours
        as part of a merger, acquisition or sale of assets. If any part of these Terms is
        unenforceable, the rest stays in effect. Our not enforcing a term is not a waiver. We are
        not liable for delays caused by events beyond our reasonable control. There are no
        third-party beneficiaries of these Terms. You must comply with U.S. export control laws. You
        agree to receive notices electronically; legal notices to us must be sent to{" "}
        {mail(site.email, "Legal notice")}
        {L.address ? ` and ${L.address}` : ""}. These Terms are the whole agreement between us about
        the Service.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these Terms? Email {mail(site.email, "Terms")}.
        {L.address ? ` ${L.entity}, ${L.address}.` : ""}
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro={
        <>
          <p>
            These Terms explain how Clippable works for clippers, streamers and brands, what you can
            expect from us and what we expect from you. Each section starts with a short summary to
            help you read it; the summaries are not part of the legal terms.
          </p>
          <p>
            Please read <a href="#disputes">Resolving disputes</a> carefully. If you live in the
            United States, it requires disputes to be resolved by individual arbitration, unless you
            opt out.
          </p>
        </>
      }
      sections={sections}
    />
  );
}
