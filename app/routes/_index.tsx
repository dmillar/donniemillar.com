import type { V2_MetaFunction, DataFunctionArgs } from "@remix-run/node";
//import morgan from "morgan";

export async function loader({ context: { app } }: DataFunctionArgs) {

  return null
}

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
          <strong>Donnie was born and raised in the San Francisco Bay Area.</strong>{" "}
          He feels fortunate to have grown up near Silicon Valley where he had early
          exposure to technology and the startup mentality. After high school he
          moved to Utah to attend college and participate in what was ultimately
          a brief collegiate baseball career. So, he put his early programming skills to work as a web
          developer for a small design firm. There he fostered a network of other
          young professionals with startup ambitions. This led to co-founding a
          few startups before graduating from the University of Utah in 2007.
          One,{" "}
          <a href="http://pacsdrive.com">
            PacsDrive
          </a>
          , resulted in a successful exit in 2010. Having studied both finance
          and computer science during university, he sought a company where he
          could merge these skillsets. Goldman Sachs was the firm that appealed
          most to him, given its position in the market and its reputation for hiring
          bright people he could learn from.
        </p>
        <p>
          <strong>He joined Goldman in 2010</strong> as an analyst on the trading desk pricing
          fixed income derivative securties&mdash;he was able to move up
          quickly, and was asked to join the investment
          research division as<em>the</em> data scientist
          embedded among the global macro markets research team. He had the
          opportunity to{" "}
          <a href="https://www.goldmansachs.com/insights/archive/world-cup-sections/world-cup-book-2014-statistical-model.html">
            work on some fun research
          </a>{" "}
          and collaborate with the best economists and market strategists in the world.
        </p>

        <p>
          <strong>Outside of work</strong> he prioritzes travel, skiing, and
          fly fishing. He&apos;s experienced cultures on nearly every
          continent&mdash;though Antarctica remains elusive for now. Recently,
          he&apos;s been enjoying time exploring the culture, food, and
          scenery of southern France. He has mentored startup founders and
          maintains civic engagements with the Human Rights Campaign, Fish for
          Garbage, and Junior Acheivement USA.
        </p>
        <p>
          If you'd like to read a sample of his research, working papers, or CV please email
          {" "}<strong>access [at] donniemillar [dot] com</strong>
        </p>
      </article>
    </main>
  );
}
