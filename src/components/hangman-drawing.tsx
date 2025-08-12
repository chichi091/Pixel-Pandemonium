
const HEAD = (
  <div key="head" className="w-12 h-12 border-[8px] border-foreground rounded-full absolute top-[48px] right-[-20px]" />
);

const BODY = (
  <div key="body" className="w-2 h-24 bg-foreground absolute top-[96px] right-0" />
);

const RIGHT_ARM = (
  <div key="right-arm" className="w-20 h-2 bg-foreground absolute top-[120px] right-[-80px] rotate-[-30deg] origin-bottom-left" />
);

const LEFT_ARM = (
  <div key="left-arm" className="w-20 h-2 bg-foreground absolute top-[120px] right-[2px] rotate-[30deg] origin-bottom-right" />
);

const RIGHT_LEG = (
  <div key="right-leg" className="w-24 h-2 bg-foreground absolute top-[182px] right-[-88px] rotate-[60deg] origin-bottom-left" />
);

const LEFT_LEG = (
  <div key="left-leg" className="w-24 h-2 bg-foreground absolute top-[182px] right-0 rotate-[-60deg] origin-bottom-right" />
);

const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

export function HangmanDrawing({ numberOfGuesses }: { numberOfGuesses: number }) {
  return (
    <div className="relative">
      {BODY_PARTS.slice(0, numberOfGuesses)}
      <div className="h-12 w-2 bg-foreground absolute top-0 right-0" />
      <div className="h-2 w-48 bg-foreground ml-24" />
      <div className="h-96 w-2 bg-foreground ml-24" />
      <div className="h-2 w-60 bg-foreground" />
    </div>
  );
}
