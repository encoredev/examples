import Image from "next/image";

export default async function Home() {
  return (
    <section>
      <h1>Starter</h1>
      <Image
        src="/encore.svg"
        alt="Encore Logo"
        width={100}
        height={24}
        priority
      />{" "}
      <span>+</span>{" "}
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={100}
        height={24}
        priority
      />
    </section>
  );
}
