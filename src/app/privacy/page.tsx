import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Clippable collects, uses and protects personal data, including sign-in with Google, Instagram and TikTok, payouts, and your privacy rights.",
  alternates: { canonical: "/privacy" },
};

const L = site.legal;
const mail = (subject: string) => (
  <a href={`mailto:${L.privacyEmail}?subject=${encodeURIComponent(subject)}`}>{L.privacyEmail}</a>
);

/*
 * Drafted to GDPR / UK GDPR / CCPA-CPRA standards and the Google, TikTok and Meta developer
 * policies that app reviews check. TODO(client): confirm vendors, OAuth scopes and retention
 * periods, and have counsel review before public launch.
 */
const sections: LegalSection[] = [
  {
    id: "scope",
    title: "Who we are",
    summary:
      "Clippable is responsible for the personal data described here. This policy covers our website, app, API and agent connectors.",
    body: (
      <>
        <p>
          {L.entity} (&ldquo;Clippable&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is the controller
          of personal data processed through clippable.net, our web app, API and agent connectors
          (the &ldquo;Service&rdquo;).
          {L.address ? ` Our address is ${L.address}.` : ""} This policy explains what we collect,
          why, who we share it with and the choices you have. It should be read with our{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "Data we collect",
    summary:
      "What you give us, what we get from the accounts you connect, and what we record when you use Clippable.",
    body: (
      <>
        <h3>You give us</h3>
        <ul>
          <li>
            Account details: name, email address, role (clipper, streamer or brand) and preferences.
          </li>
          <li>Campaign details: budgets, rates, rules and the content you make available.</li>
          <li>Messages you send us and feedback.</li>
        </ul>
        <h3>From accounts you connect</h3>
        <ul>
          <li>
            <strong>Sign-in providers.</strong> If you sign in with Google, Instagram or TikTok, we
            receive the basic profile you allow: your name, email address (where provided), profile
            picture, handle and account ID. We never receive your password.
          </li>
          <li>
            <strong>Social and streaming accounts.</strong> If you connect accounts to post clips or
            track campaigns, we receive the data needed for that feature, such as post links and
            view, like and comment counts, and access tokens that let us act on your instructions.
          </li>
        </ul>
        <h3>Content</h3>
        <ul>
          <li>
            Streams you choose to clip and the clips, captions and transcripts we create from them.
            These can include the faces, voices and names of streamers and anyone appearing on
            stream.
          </li>
        </ul>
        <h3>Payouts</h3>
        <ul>
          <li>
            To pay you, our payment processor collects identity, bank and tax details (such as a tax
            ID on a Form W-9 or W-8). We receive limited information back, such as your payout
            status and the last digits of your account.
          </li>
        </ul>
        <h3>Recorded automatically</h3>
        <ul>
          <li>
            Device and usage data: IP address, browser, pages viewed, actions taken, and logs of API
            and AI agent activity.
          </li>
          <li>Signals we use to detect fake views and fraud.</li>
          <li>Cookies and similar technologies (see section 9).</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it, and why",
    summary:
      "To run Clippable, pay people, keep the platform fair and safe, and improve it. Marketing only with your consent.",
    body: (
      <>
        <p>
          Where the GDPR or UK GDPR applies, we rely on the legal bases below. Elsewhere, we use
          data for the same purposes.
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Purpose</th>
              <th scope="col">Legal basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Create and run your account; clip streams; post clips you ask us to post</td>
              <td>Contract</td>
            </tr>
            <tr>
              <td>Run campaigns, count verified views, calculate and send payouts</td>
              <td>Contract</td>
            </tr>
            <tr>
              <td>Tax reporting, identity checks and responding to lawful requests</td>
              <td>Legal obligation</td>
            </tr>
            <tr>
              <td>Detect fake views, fraud and abuse; keep the Service secure</td>
              <td>Legitimate interests (a fair, safe marketplace)</td>
            </tr>
            <tr>
              <td>Understand usage and improve the Service</td>
              <td>Legitimate interests (a better product)</td>
            </tr>
            <tr>
              <td>Service emails, such as security and policy notices</td>
              <td>Contract and legitimate interests</td>
            </tr>
            <tr>
              <td>Marketing emails and non-essential cookies</td>
              <td>Consent, which you can withdraw at any time</td>
            </tr>
          </tbody>
        </table>
        <p>
          We do not sell your personal data, and we do not use your streams, clips or uploads to
          train general-purpose AI models.
        </p>
      </>
    ),
  },
  {
    id: "automated",
    title: "Automated decisions",
    summary:
      "We use automated checks to spot fake views, but a person reviews any decision to withhold pay.",
    body: (
      <p>
        We use automated signals to flag views or accounts that look artificial. A flag alone does
        not decide your payout: a person reviews it before earnings are withheld or reversed. You
        can ask for that review to be explained and contest the outcome by contacting{" "}
        {mail("Payout review")}.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    summary:
      "Service providers who work for us, the campaign you take part in, and the platforms you ask us to post to. Never sold.",
    body: (
      <>
        <ul>
          <li>
            <strong>Service providers</strong> that process data on our behalf under contract:
            hosting and infrastructure (Vercel), databases and storage, email delivery, analytics,
            error monitoring, and AI providers that transcribe speech and help find moments.
          </li>
          <li>
            <strong>Payment processing.</strong> Payouts and payments are handled by{" "}
            {L.payoutProcessor}, which processes data under its own{" "}
            <a href="https://stripe.com/privacy" rel="noopener noreferrer" target="_blank">
              Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Campaign Owners.</strong> If you post for a campaign, the streamer or brand
            running it sees your clips, handle and their performance.
          </li>
          <li>
            <strong>Platforms you choose.</strong> When you post or connect an account, data goes to
            that platform (for example TikTok, YouTube, Instagram or X) under its own policy.
          </li>
          <li>
            <strong>Legal and safety.</strong> Where required by law, or to protect the rights,
            safety and security of our users, the public or Clippable.
          </li>
          <li>
            <strong>Business transfers.</strong> As part of a merger, acquisition or sale of assets,
            with this policy continuing to apply.
          </li>
        </ul>
        <p>
          A current list of our service providers is available on request at{" "}
          {mail("Subprocessor list")}.
        </p>
      </>
    ),
  },
  {
    id: "google",
    title: "Google user data",
    summary: "We follow Google's Limited Use rules for anything we receive through Google sign-in.",
    body: (
      <>
        <p>
          Clippable&rsquo;s use and transfer of information received from Google APIs adheres to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We use Google data only to sign you in and
          provide features you request. We do not use it for advertising, do not sell it, and do not
          use it to train generalised AI or machine-learning models.
        </p>
        <p>
          You can remove Clippable&rsquo;s access at any time from your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Account permissions
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "social",
    title: "TikTok and Instagram data",
    summary:
      "Used only to sign you in and run the features you turn on. Disconnect any time and we delete it.",
    body: (
      <p>
        If you sign in with or connect TikTok or Instagram, we use the profile and account data
        those platforms share only to sign you in and provide the features you enable, such as
        posting clips or tracking their views. We do not sell it or use it for advertising. You can
        disconnect an account in your Clippable settings or from the platform&rsquo;s own app
        settings. To have data we received from TikTok or Instagram deleted, disconnect the account
        and email {mail("Delete my platform data")}; we will delete it within 30 days, except where
        we must keep records by law.
      </p>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    summary: "Your data may be processed in the US and elsewhere, with legal safeguards in place.",
    body: (
      <p>
        We and our providers may process data in the United States and other countries. When we
        transfer personal data from the EU, UK or Switzerland, we rely on the European
        Commission&rsquo;s Standard Contractual Clauses, the UK International Data Transfer
        Addendum, or a provider&rsquo;s certification under the EU-U.S. Data Privacy Framework and
        its UK and Swiss extensions.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    summary: "Essential cookies keep you signed in. Anything else is optional.",
    body: (
      <p>
        We use essential cookies and similar storage to keep you signed in, remember preferences
        (such as whether you&rsquo;re viewing as a clipper or streamer) and keep the Service secure.
        If we add analytics or marketing cookies, we will ask for your consent where the law
        requires it, and we honour Global Privacy Control signals. We do not use advertising pixels
        that share your data with ad networks.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    summary: "Only as long as we need it, then we delete it.",
    body: (
      <ul>
        <li>Account data: while your account is open, and up to 90 days after you close it.</li>
        <li>Stream recordings used for clipping: deleted shortly after clips are made.</li>
        <li>Clips and captions: until you delete them or close your account.</li>
        <li>Access tokens for connected accounts: until you disconnect the account.</li>
        <li>Payment and tax records: as long as tax law requires, typically 7 years.</li>
        <li>Security and usage logs: up to 12 months.</li>
      </ul>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    summary:
      "You can access, correct, delete or download your data, and object to some uses. Email us and we'll respond within a month.",
    body: (
      <>
        <p>Depending on where you live, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you, and get a copy in a portable format.</li>
          <li>Correct inaccurate data.</li>
          <li>Delete your data.</li>
          <li>
            Object to, or ask us to restrict, certain processing, including processing based on
            legitimate interests.
          </li>
          <li>Withdraw consent at any time, without affecting processing that already happened.</li>
          <li>
            Not be subject to a decision based solely on automated processing that significantly
            affects you.
          </li>
          <li>Complain to your data protection authority.</li>
        </ul>
        <h3>California and other US states</h3>
        <p>
          Residents of California and other states with privacy laws can ask to know, access,
          correct and delete personal information, and to limit the use of sensitive personal
          information (such as tax and bank details), which we use only to pay you and meet legal
          obligations. We do not sell or &ldquo;share&rdquo; personal information for cross-context
          behavioural advertising. We will not treat you differently for using your rights. You may
          use an authorised agent, and you can appeal a decision by replying to our response.
        </p>
        <h3>How to ask</h3>
        <p>
          Email {mail("Privacy request")} from the address on your account. We may need to verify
          your identity, and we will respond within one month (or 45 days where US state law
          applies), telling you if we need longer.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    summary: `Clippable is for people ${L.minAge} and over.`,
    body: (
      <p>
        The Service is not directed to children, and you must be at least {L.minAge} to use it. We
        do not knowingly collect personal data from anyone under {L.minAge}. If you believe a child
        has given us personal data, contact {mail("Child account")} and we will delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    summary:
      "We protect your data with industry-standard measures and tell you if something goes wrong.",
    body: (
      <p>
        We use measures such as encryption in transit and at rest, access controls and least
        privilege for staff, and secure storage of access tokens. No system is perfectly secure; if
        a breach affects your personal data, we will notify you and the relevant authorities as the
        law requires.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    summary: "We'll tell you about important changes before they apply.",
    body: (
      <p>
        We may update this policy. The date at the top shows when it last changed. For material
        changes we will notify you by email or in the Service before they take effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions or requests about your privacy? Email {mail("Privacy")}.
        {L.address ? ` ${L.entity}, ${L.address}.` : ""}
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={
        <p>
          Clippable turns livestreams into clips, so we handle some personal data, including from
          the accounts you connect. This policy explains exactly what, why, and the control you
          have. Each section starts with a short summary; the full text is what applies.
        </p>
      }
      sections={sections}
    />
  );
}
