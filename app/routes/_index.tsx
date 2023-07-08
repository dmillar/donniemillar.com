import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Donnie Millar" },
    { name: "description", content: "Personal website for data science and quantitative developer Donnie Millar." },
  ];
};

export default function Index() {
  return (
    <main className="container items-center mx-auto py-20 px-2 max-w-2xl font-light">
      <img
        src="/images/hedcut.webp"
        alt="Black and white portrait illustration of Donnie Millar"
        className="mx-auto"
        width={285}
        height={285}
      />
      <header className="text-center mt-20 mb-10">
        <h1 className="font-bold text-3xl text-black">Donnie Millar</h1>
        <h2 className="text-center">
          Data Scientist and Quantitative Developer
        </h2>
      </header>
      <article className="space-y-4">
        <p>
          <strong>I was born and raised in the San Francisco Bay Area.</strong>{" "}
          I am fortunate to have grown up near Silicon Valley where I had early
          exposure to technology and the startup mentality. After high school, I
          moved to Utah to attend college and participate in what was ultimately
          a brief collegiate baseball career. So, I began working as a web
          developer for a small design firm which fostered a network of other
          young professionals with startup ambitions. This led to co-founding a
          few startups before graduating from the University of Utah in 2007.
          One,{" "}
          <a href="http://pacsdrive.com">
            PacsDrive
          </a>
          , resulted in a successful exit in 2010. Having studied both finance
          and computer science during my undergrad, I sought a company where I
          could merge these skillsets. Goldman Sachs was the firm that appealed
          most to me, given its position in the market and reputation for hiring
          the best people.
        </p>
        <p>
          <strong>I joined Goldman in 2010</strong> as an analyst calculating
          security prices on the fixed income trading desk&mdash; I moved up
          quickly. In late 2012, I transitioned to publishing investment
          research where I carved out a niche as <em>the</em> data scientist
          embedded among the global macro markets research team. I had the
          opportunity to{" "}
          <a href="https://www.goldmansachs.com/insights/archive/world-cup-sections/world-cup-book-2014-statistical-model.html">
            work on some fun research
          </a>{" "}
          and collaborate with the some of the best minds in economics and
          financial markets.
        </p>

        <p>
          <strong>Outside of work</strong> I prioritze traveling, skiing, and
          fly fishing. I&apos;ve had amazing experiences on nearly every
          continent&mdash;Antarctica remains elusive for now. Recently, though,
          I&apos;ve been enjoying more time exploring the culture, food, and
          scenery of southern France. I also mentor startup founders in Utah and
          have civic engagements with the Human Rights Campaign, Fish for
          Garbage, and Junior Acheivement USA.
        </p>
        <p>
          For access to my resume and publications please send an email to{" "}
          <br />
          <strong>access [at] donniemillar [dot] com</strong>
        </p>
      </article>
    </main>
  );
}
