"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Mode = "dream" | "owned";
type PhotoSlot = "current" | "target";
type Length = "ベリーショート" | "ショート" | "ミディアム";
type HairType = "軟毛" | "普通" | "硬毛" | "くせ毛";
type Volume = "少なめ" | "普通" | "多め";
type Finish = "マット" | "ナチュラル" | "ツヤ";

type WaxProduct = {
  brand: string;
  name: string;
  type: string;
  hold: number;
  shine: number;
  lengths: Length[];
  hairTypes: HairType[];
  finishes: Finish[];
  strengths: string[];
  description: string;
  jar: "black" | "sand" | "navy" | "white" | "silver" | "amber";
  officialUrl: string;
  amazonQuery: string;
};

type StyleProfile = {
  name: string;
  eyebrow: string;
  summary: string;
  finish: Finish;
  direction: string;
  tips: string[];
  celebrityNote?: string;
};

const products: WaxProduct[] = [
  {
    brand: "LIPPS",
    name: "マットハードワックス",
    type: "マット",
    hold: 5,
    shine: 1,
    lengths: ["ベリーショート", "ショート", "ミディアム"],
    hairTypes: ["軟毛", "普通", "硬毛"],
    finishes: ["マット", "ナチュラル"],
    strengths: ["束感", "立ち上げ", "無造作"],
    description: "ツヤを抑え、細かな束感と立ち上がりを作りやすいハード系。",
    jar: "black",
    officialUrl: "https://lipps-product.com/shop/products/DZ-X51Z-RP8E",
    amazonQuery: "LIPPS マットハードワックス",
  },
  {
    brand: "LIPPS",
    name: "ハードアクティブワックス",
    type: "ナチュラル",
    hold: 5,
    shine: 2,
    lengths: ["ベリーショート", "ショート", "ミディアム"],
    hairTypes: ["普通", "硬毛", "くせ毛"],
    finishes: ["ナチュラル", "マット"],
    strengths: ["束感", "キープ", "動き"],
    description: "しっかり動かしながら自然な質感に。短髪からミディアムまで対応。",
    jar: "white",
    officialUrl: "https://lipps-product.com/shop/products/5D-RE31-CR5X",
    amazonQuery: "LIPPS ハードアクティブワックス",
  },
  {
    brand: "OCEAN TRICO",
    name: "クレイ N",
    type: "クレイ",
    hold: 5,
    shine: 1,
    lengths: ["ベリーショート", "ショート", "ミディアム"],
    hairTypes: ["軟毛", "普通", "硬毛"],
    finishes: ["マット"],
    strengths: ["ボリューム", "ドライ質感", "立ち上げ"],
    description: "軽いドライな質感。ぺたんとしやすい髪のボリューム作りにも。",
    jar: "navy",
    officialUrl: "https://oceantrico.com/product/clay-n-80g/",
    amazonQuery: "OCEAN TRICO クレイ N",
  },
  {
    brand: "NAKANO",
    name: "スタイリング タント ワックス 7",
    type: "ファイバー",
    hold: 5,
    shine: 2,
    lengths: ["ベリーショート", "ショート", "ミディアム"],
    hairTypes: ["普通", "硬毛", "くせ毛"],
    finishes: ["ナチュラル", "マット"],
    strengths: ["伸び", "毛束", "再整髪"],
    description: "伸ばしやすく、毛束を動かしやすい。扱いやすさ重視の定番候補。",
    jar: "sand",
    officialUrl: "https://www.nakano-seiyaku.co.jp/products/tanto/items/",
    amazonQuery: "ナカノ スタイリング タント ワックス 7",
  },
  {
    brand: "NAKANO",
    name: "スタイリング タント グリース 4",
    type: "グリース",
    hold: 3,
    shine: 5,
    lengths: ["ショート", "ミディアム"],
    hairTypes: ["普通", "硬毛", "くせ毛"],
    finishes: ["ツヤ", "ナチュラル"],
    strengths: ["ツヤ", "毛流れ", "ウェット"],
    description: "ツヤとまとまりを出したい日に。センターパートやパーマ風に好相性。",
    jar: "amber",
    officialUrl: "https://www.nakano-seiyaku.co.jp/products/tanto/items/",
    amazonQuery: "ナカノ スタイリング タント グリース 4",
  },
  {
    brand: "LIPPS",
    name: "グロスムーブワックス",
    type: "グロス",
    hold: 3,
    shine: 5,
    lengths: ["ショート", "ミディアム"],
    hairTypes: ["普通", "硬毛", "くせ毛"],
    finishes: ["ツヤ", "ナチュラル"],
    strengths: ["濡れ感", "毛流れ", "パーマ"],
    description: "濡れたようなツヤと柔らかな動き。大人っぽい毛流れスタイル向け。",
    jar: "silver",
    officialUrl: "https://lipps-product.com/shop/products/Y5-EAB3-RT6X",
    amazonQuery: "LIPPS グロスムーブワックス",
  },
];

const lessonSteps = [
  {
    number: "01",
    title: "根元を濡らして、寝ぐせをリセット",
    text: "毛先だけでなく、つぶれた根元まで軽く濡らします。指を入れて地肌から動かすと、あとで狙った方向へ立ち上げやすくなります。",
    tip: "びしょ濡れにせず、根元が動く程度でOK。",
    image: "/tutorial/step-01.webp",
  },
  {
    number: "02",
    title: "ドライで、スタイルの土台を作る",
    text: "根元を起こしたい方向と逆から風を当て、最後に流したい方向へ整えます。形の8割はドライで決まります。",
    tip: "前髪を上げるなら、下から温風→冷風で固定。",
    image: "/tutorial/step-02.webp",
  },
  {
    number: "03",
    title: "少量を伸ばし、後ろからなじませる",
    text: "小豆1粒分を手のひらと指の間まで透明になるように伸ばし、後頭部→サイド→トップの順で髪の中間から毛先へ。",
    tip: "足りなければ追加。最初から付けすぎない。",
    image: "/tutorial/step-03.webp",
  },
  {
    number: "04",
    title: "束をつまみ、輪郭を整える",
    text: "作りすぎたボリュームを抑えながら、欲しい場所だけ毛束をつまみます。最後に鏡を少し離して全体を確認。",
    tip: "キープしたい日は20〜30cm離してスプレー。",
    image: "/tutorial/step-04.webp",
  },
];

const AMAZON_ASSOCIATE_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim() || "hei5731-22";

const SALON_AFFILIATE_URL =
  process.env.NEXT_PUBLIC_SALON_AFFILIATE_URL?.trim() ||
  "https://beauty.hotpepper.jp/";

function amazonUrl(query: string) {
  const params = new URLSearchParams({ k: query });
  if (AMAZON_ASSOCIATE_TAG) params.set("tag", AMAZON_ASSOCIATE_TAG);
  return `https://www.amazon.co.jp/s?${params.toString()}`;
}

function youtubeUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} 使い方 メンズヘア`)}`;
}

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M5 12h13"/><path d="m14 7 5 5-5 5"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 14v5h14v-5"/></>,
    camera: <><path d="M4 7h3l1.4-2h7.2L17 7h3v12H4z"/><circle cx="12" cy="13" r="4"/></>,
    paste: <><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.8 7.7 7 10 4.2-2.3 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
    spark: <><path d="m12 3 1.4 4.1L18 8.5l-4.6 1.4L12 14l-1.4-4.1L6 8.5l4.6-1.4z"/><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></>,
    play: <path d="m9 7 8 5-8 5z"/>,
    pause: <><path d="M9 7v10M15 7v10"/></>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    external: <><path d="M14 5h5v5"/><path d="m10 14 9-9"/><path d="M19 14v5H5V5h5"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 17 5-4 3 2 3-3 5 5"/></>,
    close: <><path d="m7 7 10 10M17 7 7 17"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div className="meter-row" aria-label={`${label} ${value}/5`}>
      <span>{label}</span>
      <span className="meter-bars">
        {[1, 2, 3, 4, 5].map((bar) => (
          <i key={bar} className={bar <= value ? "active" : ""} />
        ))}
      </span>
    </div>
  );
}

function ProductJar({ product }: { product: WaxProduct }) {
  return (
    <div className={`product-jar ${product.jar}`} aria-hidden="true">
      <div className="jar-lid" />
      <div className="jar-body">
        <span>{product.brand}</span>
        <b>{product.type}</b>
      </div>
    </div>
  );
}

function styleFromGoal(goal: string, selectedFinish: Finish): StyleProfile {
  const value = goal.trim().toLowerCase();
  if (/センター|毛流れ|かきあげ/.test(value)) {
    return {
      name: "ナチュラルセンターパート",
      eyebrow: "清潔感と大人っぽさを両立",
      summary: "根元を立ち上げつつ、サイドへ自然につながる毛流れを作るスタイル。",
      finish: selectedFinish === "マット" ? "ナチュラル" : selectedFinish,
      direction: "前髪の根元を左右へ振り分けてから後ろへ流す",
      tips: ["分け目を一直線にしすぎない", "耳上はタイトに抑える", "顔まわりを少し残すと自然"],
    };
  }
  if (/アップ|短髪|ショート|爽やか|スポーツ/.test(value)) {
    return {
      name: "爽やかアップバング",
      eyebrow: "朝に強い、崩れにくい短髪セット",
      summary: "前髪を上げ、サイドを抑えて縦のシルエットを作る清潔感のあるスタイル。",
      finish: "マット",
      direction: "前髪は下から、サイドは上から風を当てる",
      tips: ["黒目の外側だけ前髪を下ろすと自然", "ハチ周りは握らず手のひらで抑える", "スプレーは根元中心"],
    };
  }
  if (/マッシュ|束感|無造作|ふわ/.test(value)) {
    return {
      name: "無造作束感マッシュ",
      eyebrow: "作り込みすぎない軽い動き",
      summary: "丸いシルエットを残しながら、表面に細い毛束とランダムな動きを足すスタイル。",
      finish: selectedFinish === "ツヤ" ? "ナチュラル" : selectedFinish,
      direction: "全体を散らしてから、毛先だけ細くつまむ",
      tips: ["トップは左右交互に振って乾かす", "束は太さを揃えない", "前髪の中央は軽く落とす"],
    };
  }
  if (/濡れ|ウェット|パーマ|色気|ツヤ/.test(value)) {
    return {
      name: "ツヤ感ウェットスタイル",
      eyebrow: "パーマやくせを活かす",
      summary: "毛先のカールと束を残し、濡れたようなツヤで立体感を見せるスタイル。",
      finish: "ツヤ",
      direction: "水分を少し残し、揉み込みながら自然乾燥",
      tips: ["グリースは内側から少量ずつ", "前髪は隙間を作る", "襟足まで忘れずなじませる"],
    };
  }
  return {
    name: "清潔感ナチュラルスタイル",
    eyebrow: goal.trim() ? `「${goal.trim().slice(0, 24)}」を自然に解釈` : "迷ったときの王道バランス",
    summary: "作り込みすぎず、トップのふんわり感と顔まわりのまとまりを両立します。",
    finish: selectedFinish,
    direction: "根元はふんわり、耳上と襟足はタイトに",
    tips: ["ワックスは小豆1粒から", "後ろ→横→上の順に付ける", "前髪は最後に整える"],
    celebrityNote: /芸能人|みたい|っぽ/.test(value)
      ? "人物の顔そのものではなく、髪型・質感・雰囲気の参考語として解釈しています。"
      : undefined,
  };
}

function findOwnedWax(name: string) {
  const normalized = name.toLowerCase().replace(/[\s　]/g, "");
  if (!normalized) return null;
  return products.find((product) => {
    const label = `${product.brand}${product.name}`.toLowerCase().replace(/[\s　]/g, "");
    return label.includes(normalized) || normalized.includes(product.name.toLowerCase().replace(/[\s　]/g, ""));
  }) ?? null;
}

function scoreProduct(
  product: WaxProduct,
  length: Length,
  hairType: HairType,
  volume: Volume,
  profile: StyleProfile,
) {
  let score = 48;
  if (product.lengths.includes(length)) score += 14;
  if (product.hairTypes.includes(hairType)) score += 12;
  if (product.finishes.includes(profile.finish)) score += 14;
  if (volume === "少なめ" && (product.type === "クレイ" || product.type === "マット")) score += 7;
  if (volume === "多め" && product.hold >= 4) score += 6;
  if (/毛流れ|センター|ウェット|ツヤ/.test(profile.name) && product.shine >= 3) score += 7;
  if (/アップ|束感|マッシュ/.test(profile.name) && product.hold >= 4) score += 7;
  if (hairType === "軟毛" && product.shine <= 2) score += 5;
  if (hairType === "硬毛" && product.hold >= 4) score += 5;
  return Math.min(98, Math.max(61, score));
}

function ownedStyles(product: WaxProduct | null, typedName: string) {
  const haystack = `${product?.type ?? ""} ${product?.strengths.join(" ") ?? ""} ${typedName}`;
  if (/グリース|グロス|ツヤ|ウェット/.test(haystack)) {
    return ["ウェットセンターパート", "ツヤ感パーマ", "タイトな七三スタイル"];
  }
  if (/クレイ|マット|立ち上げ/.test(haystack)) {
    return ["無造作マッシュ", "爽やかアップバング", "束感ショート"];
  }
  return ["ナチュラルセンターパート", "ニュアンスマッシュ", "毛流れショート"];
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("dream");
  const [activePhoto, setActivePhoto] = useState<PhotoSlot>("current");
  const [photos, setPhotos] = useState<Record<PhotoSlot, string | null>>({ current: null, target: null });
  const [goal, setGoal] = useState("");
  const [ownedWax, setOwnedWax] = useState("");
  const [length, setLength] = useState<Length>("ショート");
  const [hairType, setHairType] = useState<HairType>("普通");
  const [volume, setVolume] = useState<Volume>("普通");
  const [finish, setFinish] = useState<Finish>("ナチュラル");
  const [uploadMessage, setUploadMessage] = useState("写真は端末内でプレビューされます");
  const [hasResult, setHasResult] = useState(false);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lessonPlaying, setLessonPlaying] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const profile = useMemo(() => styleFromGoal(goal, finish), [goal, finish]);
  const ownedProduct = useMemo(() => findOwnedWax(ownedWax), [ownedWax]);
  const rankedProducts = useMemo(
    () => products
      .map((product) => ({ product, score: scoreProduct(product, length, hairType, volume, profile) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3),
    [length, hairType, volume, profile],
  );

  useEffect(() => {
    if (!lessonPlaying) return;
    const timer = window.setInterval(() => {
      setLessonIndex((current) => (current + 1) % lessonSteps.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [lessonPlaying]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const readImage = (file: File, slot = activePhoto) => {
    if (!file.type.startsWith("image/")) {
      setUploadMessage("画像ファイル（JPG・PNG・WEBPなど）を選んでください");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage("10MB以下の画像を選んでください");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((current) => ({ ...current, [slot]: String(reader.result) }));
      setUploadMessage(slot === "current" ? "今の髪の写真を追加しました" : "理想の髪型画像を追加しました");
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) readImage(file);
    event.target.value = "";
  };

  const onPaste = (event: ClipboardEvent<HTMLElement>) => {
    const item = Array.from(event.clipboardData.items).find((entry) => entry.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (file) {
      event.preventDefault();
      readImage(file);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboard = navigator.clipboard as Clipboard & { read?: () => Promise<ClipboardItems> };
      if (!clipboard.read) throw new Error("unsupported");
      const items = await clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          readImage(new File([blob], "pasted-image", { type: imageType }));
          return;
        }
      }
      setUploadMessage("クリップボードに画像が見つかりませんでした");
    } catch {
      setUploadMessage("この端末では、枠を選んで Ctrl/⌘＋V で貼り付けてください");
    }
  };

  const diagnose = () => {
    if (mode === "owned" && !ownedWax.trim()) {
      setUploadMessage("持っているワックスの商品名を入力してください");
      document.getElementById("owned-wax-input")?.focus();
      return;
    }
    setHasResult(true);
    window.setTimeout(() => scrollTo("result"), 80);
  };

  const chooseMode = (next: Mode) => {
    setMode(next);
    setHasResult(false);
    scrollTo("diagnosis");
  };

  const activePreview = photos[activePhoto];
  const lesson = lessonSteps[lessonIndex];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="セットナビ トップ">
          <span className="brand-mark">S</span>
          <span>セットナビ</span>
        </a>
        <nav aria-label="メインナビゲーション">
          <a href="#diagnosis">髪型から探す</a>
          <a href="#wax-list">ワックスから探す</a>
          <a href="#lesson">使い方</a>
        </nav>
        <button className="header-cta" onClick={() => chooseMode("dream")}>無料で診断</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="pill"><Icon name="spark" size={17}/> メンズヘア診断</p>
          <h1>そのワックスで、<br/><em>どこまで変われる？</em></h1>
          <p className="hero-lead">
            写真を追加するか、「〇〇（芸能人）の髪形みたいにしたい」と入力するだけ。<br/>
            髪質と理想に合う髪型・市販ワックス・セット方法がわかります。
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => chooseMode("dream")}>
              無料で診断する <Icon name="arrow" size={20}/>
            </button>
            <button className="button secondary" onClick={() => chooseMode("owned")}>
              持っているワックスを調べる <Icon name="arrow" size={20}/>
            </button>
          </div>
          <div className="trust-row">
            <div><span><Icon name="shield"/></span><p><b>診断無料・登録不要</b><small>すぐに結果を確認</small></p></div>
            <div><span><Icon name="check"/></span><p><b>初心者でも安心</b><small>手順をわかりやすく</small></p></div>
            <div><span><Icon name="lock"/></span><p><b>写真は非公開</b><small>端末内プレビュー</small></p></div>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.current ?? "/hero-man.webp"} alt={photos.current ? "追加した現在の髪型写真" : "自然な毛流れのメンズヘアスタイル例"}/>
            {photos.current && (
              <button className="photo-remove" onClick={() => setPhotos((current) => ({ ...current, current: null }))} aria-label="写真を削除"><Icon name="close" size={18}/></button>
            )}
          </div>
          <div className="hero-input-panel">
            <button className="upload-main" onClick={() => { setActivePhoto("current"); uploadRef.current?.click(); }}>
              <Icon name="upload" size={29}/>
              <span><b>写真をアップロード</b><small>クリックしてJPG・PNG・WEBPを選択</small></span>
            </button>
            <div className="or"><span/>または<span/></div>
            <label className="quick-message">
              <Icon name="search" size={22}/>
              <input value={goal} onChange={(event) => setGoal(event.target.value)} aria-label="なりたい髪型" placeholder="〇〇（芸能人）の髪形みたいにしたい" maxLength={120}/>
            </label>
          </div>
        </div>
      </section>

      <section className="popular section" id="wax-list">
        <div className="section-heading compact">
          <div>
            <p className="section-kicker">POPULAR WAX</p>
            <h2>まずは人気の3タイプから</h2>
          </div>
          <button className="text-link" onClick={() => chooseMode("dream")}>自分に合う順に見る <Icon name="arrow" size={17}/></button>
        </div>
        <div className="product-grid popular-grid">
          {products.slice(0, 3).map((product) => (
            <article className="product-card" key={product.name}>
              <ProductJar product={product}/>
              <div className="product-info">
                <p className="product-brand">{product.brand}</p>
                <h3>{product.name}</h3>
                <div className="tags"><span>{product.type}</span><span>{product.strengths[0]}</span></div>
                <Meter label="キープ力" value={product.hold}/>
                <Meter label="ツヤ" value={product.shine}/>
                <a className="amazon-link" href={amazonUrl(product.amazonQuery)} target="_blank" rel="sponsored nofollow noopener noreferrer">Amazonで見る <Icon name="arrow" size={17}/></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="diagnosis-section" id="diagnosis">
        <div className="section-heading centered">
          <p className="section-kicker">FREE DIAGNOSIS</p>
          <h2>あなたの髪と理想を教えてください</h2>
          <p>約1分。入力内容から、今日試せる組み合わせを提案します。</p>
        </div>

        <div className="diagnosis-shell">
          <div className="mode-tabs" role="tablist" aria-label="診断方法">
            <button className={mode === "dream" ? "active" : ""} onClick={() => { setMode("dream"); setHasResult(false); }} role="tab" aria-selected={mode === "dream"}>
              <Icon name="spark"/> なりたい髪型から
            </button>
            <button className={mode === "owned" ? "active" : ""} onClick={() => { setMode("owned"); setHasResult(false); }} role="tab" aria-selected={mode === "owned"}>
              <Icon name="search"/> 持っているワックスから
            </button>
          </div>

          <div className="diagnosis-body">
            <div className="diagnosis-left">
              <div className="field-heading">
                <span className="step-number">1</span>
                <div><h3>写真を追加（任意）</h3><p>今の髪と、理想の参考画像をそれぞれ追加できます。</p></div>
              </div>

              <div className="photo-tabs">
                <button className={activePhoto === "current" ? "active" : ""} onClick={() => setActivePhoto("current")}>今の自分の髪 {photos.current && <b>✓</b>}</button>
                <button className={activePhoto === "target" ? "active" : ""} onClick={() => setActivePhoto("target")}>なりたい髪型の画像 {photos.target && <b>✓</b>}</button>
              </div>

              <div className={`drop-zone ${activePreview ? "has-image" : ""}`} tabIndex={0} onPaste={onPaste} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (file) readImage(file); }}>
                {activePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activePreview} alt={activePhoto === "current" ? "追加した現在の髪型" : "追加した理想の髪型"}/>
                    <button className="photo-remove" onClick={() => setPhotos((current) => ({ ...current, [activePhoto]: null }))} aria-label="写真を削除"><Icon name="close" size={18}/></button>
                    <p className="image-label"><Icon name="check" size={16}/> {activePhoto === "current" ? "今の髪" : "理想の髪型"}を追加済み</p>
                  </>
                ) : (
                  <>
                    <span className="drop-icon"><Icon name="image" size={34}/></span>
                    <h4>{activePhoto === "current" ? "今の髪が分かる写真" : "参考にしたい髪型画像"}を追加</h4>
                    <p>ドラッグ＆ドロップ、クリック、または貼り付け</p>
                  </>
                )}
                <div className="upload-actions">
                  <button onClick={() => uploadRef.current?.click()}><Icon name="upload" size={18}/> ファイル</button>
                  {activePhoto === "current" && <button onClick={() => cameraRef.current?.click()}><Icon name="camera" size={18}/> 撮影</button>}
                  <button onClick={pasteFromClipboard}><Icon name="paste" size={18}/> 貼り付け</button>
                </div>
              </div>
              <p className="upload-status" aria-live="polite"><Icon name="lock" size={14}/> {uploadMessage}。最大10MB。</p>

              <input ref={uploadRef} className="sr-only" type="file" accept="image/*" onChange={onFileChange}/>
              <input ref={cameraRef} className="sr-only" type="file" accept="image/*" capture="user" onChange={onFileChange}/>

              <div className="field-heading second">
                <span className="step-number">2</span>
                <div><h3>{mode === "dream" ? "なりたい雰囲気をひとこと" : "持っているワックスの商品名"}</h3><p>{mode === "dream" ? "有名人名や「爽やか」「濡れ感」でもOK。" : "ブランド名だけでも候補を探します。"}</p></div>
              </div>

              {mode === "dream" ? (
                <label className="message-box">
                  <textarea value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="〇〇（芸能人）の髪形みたいにしたい" rows={3} maxLength={120}/>
                  <span>{goal.length}/120</span>
                </label>
              ) : (
                <label className="owned-input">
                  <Icon name="search"/>
                  <input id="owned-wax-input" value={ownedWax} onChange={(event) => setOwnedWax(event.target.value)} placeholder="例：LIPPS マットハードワックス"/>
                </label>
              )}
            </div>

            <div className="diagnosis-right">
              <div className="field-heading">
                <span className="step-number">3</span>
                <div><h3>髪の状態を選ぶ</h3><p>迷ったら「普通」のままで大丈夫です。</p></div>
              </div>

              <OptionGroup label="髪の長さ" options={["ベリーショート", "ショート", "ミディアム"]} value={length} onChange={(value) => setLength(value as Length)}/>
              <OptionGroup label="髪質" options={["軟毛", "普通", "硬毛", "くせ毛"]} value={hairType} onChange={(value) => setHairType(value as HairType)}/>
              <OptionGroup label="毛量" options={["少なめ", "普通", "多め"]} value={volume} onChange={(value) => setVolume(value as Volume)}/>
              {mode === "dream" && <OptionGroup label="仕上がり" options={["マット", "ナチュラル", "ツヤ"]} value={finish} onChange={(value) => setFinish(value as Finish)}/>}

              <button className="diagnose-button" onClick={diagnose}>
                <span><Icon name="spark"/> {mode === "dream" ? "おすすめを診断する" : "作れる髪型を調べる"}</span>
                <Icon name="arrow"/>
              </button>
              <p className="beta-note">β版では写真は端末内の参考プレビューです。診断結果は選択項目とメッセージを中心に判定します。</p>
            </div>
          </div>
        </div>
      </section>

      {hasResult && (
        <section className="result-section" id="result" aria-live="polite">
          <div className="result-header">
            <span className="result-check"><Icon name="check" size={27}/></span>
            <p>診断できました</p>
            <h2>{mode === "dream" ? "あなたに似合うセット案" : "そのワックスで作れる髪型"}</h2>
          </div>

          {mode === "dream" ? (
            <>
              <div className="style-result-card">
                <div className="style-visual">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photos.target ?? photos.current ?? "/hero-man.webp"} alt="診断したヘアスタイルの参考"/>
                  <span>STYLE MATCH</span>
                </div>
                <div className="style-result-copy">
                  <p className="section-kicker">YOUR STYLE</p>
                  <h3>{profile.name}</h3>
                  <p className="result-eyebrow">{profile.eyebrow}</p>
                  <p>{profile.summary}</p>
                  <dl>
                    <div><dt>質感</dt><dd>{profile.finish}</dd></div>
                    <div><dt>ドライ方向</dt><dd>{profile.direction}</dd></div>
                    <div><dt>今の条件</dt><dd>{length}・{hairType}・毛量{volume}</dd></div>
                  </dl>
                  <ul>{profile.tips.map((tip) => <li key={tip}><Icon name="check" size={16}/>{tip}</li>)}</ul>
                  {profile.celebrityNote && <p className="celebrity-note">{profile.celebrityNote}</p>}
                </div>
              </div>

              <div className="result-products-heading">
                <div><p className="section-kicker">WAX MATCH</p><h3>相性のいい市販ワックス TOP 3</h3></div>
                <p>一致度は入力条件との組み合わせを目安表示しています。</p>
              </div>
              <div className="product-grid result-grid">
                {rankedProducts.map(({ product, score }, index) => (
                  <ResultProductCard key={product.name} product={product} score={score} rank={index + 1}/>
                ))}
              </div>
            </>
          ) : (
            <OwnedWaxResult product={ownedProduct} typedName={ownedWax}/>
          )}

          <div className="affiliate-disclosure">
            <Icon name="shield" size={20}/>
            <p><b>商品リンクについて</b><br/>セットナビはAmazonのアソシエイトとして、適格販売により収入を得ています。価格・在庫はAmazonの商品ページでご確認ください。</p>
          </div>
        </section>
      )}

      <section className="salon-bridge" aria-labelledby="salon-heading">
        <div className="salon-copy">
          <p className="section-kicker">SALON MATCH</p>
          <h2 id="salon-heading">カットから整えると、<br/>セットはもっと簡単になる。</h2>
          <p>ワックスだけで再現しにくいときは、前髪の長さ・毛量・トップのレイヤーをプロに相談。診断結果や理想の画像を見せると、希望が伝わりやすくなります。</p>
          <ul>
            <li><Icon name="check" size={17}/> メンズカットが得意なサロンを比較</li>
            <li><Icon name="check" size={17}/> スタイル写真・口コミ・空き時間を確認</li>
          </ul>
        </div>
        <div className="salon-action-card">
          <span className="salon-icon"><Icon name="spark" size={28}/></span>
          <p>理想に近いスタイルを見つけたら</p>
          <h3>その髪型が得意な美容師へ</h3>
          <a href={SALON_AFFILIATE_URL} target="_blank" rel="sponsored nofollow noopener noreferrer">
            ホットペッパービューティーで探す <Icon name="external" size={18}/>
          </a>
          <small>外部の美容室検索・予約サイトへ移動します</small>
        </div>
      </section>

      <section className="lesson-section" id="lesson">
        <div className="section-heading centered light">
          <p className="section-kicker">HOW TO STYLE</p>
          <h2>ワックスの付け方、基本の4ステップ</h2>
          <p>初心者が失敗しやすいポイントを、実写で1つずつ確認できます。</p>
        </div>

        <div className="lesson-player">
          <div className="lesson-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lesson.image} alt={`${lesson.title}の実演写真`}/>
            <div className="lesson-photo-shade"/>
            <div className="lesson-number">{lesson.number}</div>
            <button className="play-button" onClick={() => setLessonPlaying((value) => !value)} aria-label={lessonPlaying ? "一時停止" : "再生"}>
              <Icon name={lessonPlaying ? "pause" : "play"} size={26}/>
            </button>
          </div>
          <div className="lesson-copy">
            <p className="lesson-count">STEP {lesson.number} / 04</p>
            <h3>{lesson.title}</h3>
            <p>{lesson.text}</p>
            <div className="pro-tip"><span>PRO TIP</span>{lesson.tip}</div>
            <div className="lesson-controls">
              <button onClick={() => setLessonIndex((lessonIndex - 1 + lessonSteps.length) % lessonSteps.length)} aria-label="前のステップ"><Icon name="chevronLeft"/></button>
              <div className="lesson-dots">
                {lessonSteps.map((step, index) => <button key={step.number} className={index === lessonIndex ? "active" : ""} onClick={() => setLessonIndex(index)} aria-label={`ステップ${index + 1}`}/>) }
              </div>
              <button onClick={() => setLessonIndex((lessonIndex + 1) % lessonSteps.length)} aria-label="次のステップ"><Icon name="chevronRight"/></button>
            </div>
            <a className="youtube-link" href={youtubeUrl("メンズ ワックス 基本 初心者")} target="_blank" rel="noopener noreferrer nofollow"><Icon name="play" size={18}/> YouTubeで使い方動画を探す <Icon name="external" size={16}/></a>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div><p className="section-kicker">READY?</p><h2>明日のセットを、今日決めよう。</h2><p>写真なしでもOK。約1分でおすすめが分かります。</p></div>
        <button className="button primary" onClick={() => chooseMode("dream")}>無料で診断する <Icon name="arrow"/></button>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">S</span><span>セットナビ</span></a>
        <p>メンズの髪型・ワックス選びを、もっと分かりやすく。</p>
        <div><a href="#diagnosis">診断</a><a href="#wax-list">ワックス</a><a href="#lesson">使い方</a></div>
        <small>※ 診断はスタイリングの目安です。使用前に各商品の注意事項をご確認ください。商品・美容室予約リンクにはアフィリエイトリンクを含む場合があります。 © 2026 SET NAVI</small>
      </footer>
    </main>
  );
}

function OptionGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset className="option-group">
      <legend>{label}</legend>
      <div>{options.map((option) => <button type="button" className={option === value ? "active" : ""} onClick={() => onChange(option)} key={option}>{option}</button>)}</div>
    </fieldset>
  );
}

function ResultProductCard({ product, score, rank }: { product: WaxProduct; score: number; rank: number }) {
  return (
    <article className="result-product-card">
      <span className="rank">{rank}</span>
      <div className="match"><b>{score}%</b><small>MATCH</small></div>
      <ProductJar product={product}/>
      <p className="product-brand">{product.brand}</p>
      <h4>{product.name}</h4>
      <p className="product-description">{product.description}</p>
      <div className="tags">{product.strengths.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <Meter label="キープ力" value={product.hold}/>
      <Meter label="ツヤ" value={product.shine}/>
      <a className="amazon-button" href={amazonUrl(product.amazonQuery)} target="_blank" rel="sponsored nofollow noopener noreferrer">Amazonで商品を見る <Icon name="external" size={17}/></a>
      <div className="sub-links">
        <a href={product.officialUrl} target="_blank" rel="noopener noreferrer">公式情報</a>
        <a href={youtubeUrl(product.amazonQuery)} target="_blank" rel="noopener noreferrer nofollow">使い方動画</a>
      </div>
    </article>
  );
}

function OwnedWaxResult({ product, typedName }: { product: WaxProduct | null; typedName: string }) {
  const styles = ownedStyles(product, typedName);
  const displayName = product ? `${product.brand} ${product.name}` : typedName;
  const type = product?.type ?? (/グリース|ジェル/.test(typedName) ? "ツヤ系" : /クレイ|マット/.test(typedName) ? "マット系" : "ナチュラル系");
  return (
    <div className="owned-result">
      <div className="owned-summary">
        {product ? <ProductJar product={product}/> : <span className="generic-wax"><Icon name="search" size={35}/></span>}
        <div>
          <p className="section-kicker">YOUR WAX</p>
          <h3>{displayName}</h3>
          <p>{product?.description ?? "商品名から近い質感を推定しました。正確なキープ力やツヤは容器の表記も確認してください。"}</p>
          <span className="owned-type">判定：{type}</span>
        </div>
      </div>
      <div className="possible-styles">
        <p className="section-kicker">POSSIBLE STYLES</p>
        <h3>このワックスで狙いやすい髪型</h3>
        <div className="style-chips">{styles.map((style, index) => <div key={style}><b>0{index + 1}</b><span>{style}</span><small>{index === 0 ? "最もおすすめ" : index === 1 ? "アレンジしやすい" : "量を調整して挑戦"}</small></div>)}</div>
        <div className="owned-tip"><Icon name="spark"/><p><b>付け方のコツ</b><br/>{product?.shine && product.shine >= 4 ? "少し水分を残してから、内側へ少量ずつ揉み込むとツヤが均一になります。" : "完全に乾かしてから小豆1粒分を伸ばし、後頭部→サイド→トップの順になじませます。"}</p></div>
        {product && <div className="owned-links"><a className="amazon-button" href={amazonUrl(product.amazonQuery)} target="_blank" rel="sponsored nofollow noopener noreferrer">同じ商品をAmazonで見る <Icon name="external" size={17}/></a><a href={youtubeUrl(product.amazonQuery)} target="_blank" rel="noopener noreferrer nofollow">使い方動画を探す <Icon name="external" size={15}/></a></div>}
      </div>
    </div>
  );
}
