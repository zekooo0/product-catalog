import Image from "next/image";

export default function SocialIcons() {
  const list: { image: string; href: string }[] = [
    {
      image: "/Facebook.png",
      href: "https://www.facebook.com/profile.php?id=61574098654423",
    },
    {
      image: "/instagram.png",
      href: "https://www.instagram.com/affiliatelist.site/",
    },
    {
      image: "/Threads.png",
      href: "https://www.threads.com/@affiliatelist.site?xmt=AQGz05ihWsELRGE0OeaAAejewGShTojj6Z2BqgcobwLkB7A",
    },
    {
      image: "/TikTok.png",
      href: "https://www.tiktok.com/@makemoneyonlinetools",
    },
    {
      image: "/YouTube.png",
      href: "https://www.youtube.com/@MakeMoneyOnlineTools",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {list.map((item) => (
        <a href={item.href} target="_blank" key={item.image}>
          <Image src={item.image} alt={item.image} width={48} height={48} />
        </a>
      ))}
    </div>
  );
}
