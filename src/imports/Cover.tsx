import imgEWallet from "figma:asset/493a4569683a62d53e1463f47634429e10edc7cf.png";

export default function Cover() {
  return (
    <div className="relative size-full" data-name="Cover">
      <div className="absolute h-[960px] left-0 top-0 w-[1920px]" data-name="E-Wallet">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgEWallet} />
      </div>
    </div>
  );
}