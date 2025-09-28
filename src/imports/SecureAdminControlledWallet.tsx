import svgPaths from "./svg-j4tocf3ugb";

function Icon() {
  return (
    <div className="h-[28px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%_8.33%_33.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-5.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 19">
            <path d={svgPaths.p2f25a400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 22">
            <path d={svgPaths.p3bfd1580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-gradient-to-b from-[#1e40af] relative rounded-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[52px] to-[#1e3a8a]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-[52px]">
        <Icon />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="basis-0 font-['Arial:Bold',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-slate-900">
        <p className="leading-[32px]">SecureWallet</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-0 not-italic text-[14px] text-nowrap text-slate-500 top-[-1.2px]">
        <p className="leading-[20px] whitespace-pre">Admin-Controlled Digital Wallet</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 grow h-[51.987px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[51.987px] items-start relative w-full" style={{ gap: "1.90735e-06px" }}>
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[52px] items-center left-[93.26px] top-0 w-[261.475px]" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%_8.32%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 19">
            <path d={svgPaths.p13594540} id="Vector" stroke="var(--stroke-0, #1E40AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(30,64,175,0.1)] relative rounded-[16px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[6px] px-[6px] relative size-[32px]">
        <Icon1 />
      </div>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[28px] relative shrink-0 w-[123.35px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[123.35px]">
        <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-0 not-italic text-[20px] text-nowrap text-slate-900 top-[-2.2px]">
          <p className="leading-[28px] whitespace-pre">Secure Access</p>
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[8px] h-[32px] items-center relative shrink-0" data-name="AuthPage">
      <Container3 />
      <CardTitle />
    </div>
  );
}

function CardDescription() {
  return (
    <div className="[grid-area:2_/_1] relative shrink-0" data-name="CardDescription">
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-0 not-italic text-[16px] text-nowrap text-slate-500 top-[-2.2px]">
        <p className="leading-[24px] whitespace-pre">Sign in to your wallet or create a new account</p>
      </div>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[114px] relative shrink-0 w-[448px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[44px_minmax(0px,_1fr)] h-[114px] pb-[16px] pt-[24px] px-[24px] relative w-[448px]">
        <AuthPage />
        <CardDescription />
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[29px] relative rounded-[20px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[8.8px] py-[4.8px] relative w-full">
          <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-900">
            <p className="leading-[20px] whitespace-pre">Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="[grid-area:1_/_2] h-[29px] relative rounded-[20px] shrink-0" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[8.8px] py-[4.8px] relative w-full">
          <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-900">
            <p className="leading-[20px] whitespace-pre">Register</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-slate-200 h-[36px] relative rounded-[20px] shrink-0 w-[400px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[36px] px-[3px] py-[3.5px] relative w-[400px]">
        <PrimitiveButton />
        <PrimitiveButton1 />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-900">
        <p className="leading-[14px] whitespace-pre">Email</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[36px] relative rounded-[14px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[12px] py-[4px] relative w-full">
          <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-500">
            <p className="leading-[normal] whitespace-pre">Enter your email</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-0 w-[400px]" data-name="Container">
      <PrimitiveLabel />
      <Input />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-900">
        <p className="leading-[14px] whitespace-pre">Password</p>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[36px] relative rounded-[14px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[12px] py-[4px] relative w-full">
          <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-500">
            <p className="leading-[normal] whitespace-pre">Enter your password</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[58px] items-start left-0 top-[74px] w-[400px]" data-name="Container">
      <PrimitiveLabel1 />
      <Input1 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-blue-800 h-[36px] left-0 rounded-[14px] top-[148px] w-[400px]" data-name="Button">
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-[178px] not-italic text-[14px] text-nowrap text-white top-[6.8px]">
        <p className="leading-[20px] whitespace-pre">Sign In</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[20px] left-[129.25px] top-[202.4px] w-[141.488px]" data-name="Button">
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-0 not-italic text-[14px] text-blue-800 text-nowrap top-[-1.2px]">
        <p className="leading-[20px] whitespace-pre">Forgot your password?</p>
      </div>
    </div>
  );
}

function AuthPage1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[400px]" data-name="AuthPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[400px]">
        <Container4 />
        <Container5 />
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[268px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <TabList />
      <AuthPage1 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-0 not-italic text-[14px] text-nowrap text-slate-900 top-[-1.2px]">
        <p className="leading-[20px] whitespace-pre">Demo Credentials:</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[32.438px]" data-name="Text">
      <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-500">
        <p className="leading-[20px] whitespace-pre">User:</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <Text />
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-[32.44px] not-italic text-[14px] text-nowrap text-slate-500 top-[-1.2px]">
        <p className="leading-[20px] whitespace-pre">user@demo.com / password123</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[18.4px] items-start left-0 top-[0.8px] w-[45.45px]" data-name="Text">
      <div className="font-['Arial:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-500">
        <p className="leading-[20px] whitespace-pre">Admin:</p>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <Text1 />
      <div className="absolute font-['Arial:Regular',_sans-serif] leading-[0] left-[45.45px] not-italic text-[14px] text-nowrap text-slate-500 top-[-1.2px]">
        <p className="leading-[20px] whitespace-pre">admin@demo.com / password123</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function AuthPage2() {
  return (
    <div className="bg-[rgba(226,232,240,0.5)] h-[105.6px] relative rounded-[16px] shrink-0 w-full" data-name="AuthPage">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(209,213,219,0.5)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[105.6px] items-start pb-[0.8px] pt-[16.8px] px-[16.8px] relative w-full">
          <Paragraph1 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function CardContent() {
  return (
    <div className="h-[421.6px] relative shrink-0 w-[448px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[24px] h-[421.6px] items-start px-[24px] py-0 relative w-[448px]">
        <PrimitiveDiv />
        <AuthPage2 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] box-border content-stretch flex flex-col gap-[24px] h-[559.6px] items-start left-0 rounded-[20px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[92px] w-[448px]" data-name="Card">
      <CardHeader />
      <CardContent />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[651.6px] relative shrink-0 w-[448px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[651.6px] relative w-[448px]">
        <Container2 />
        <Card />
      </div>
    </div>
  );
}

export default function SecureAdminControlledWallet() {
  return (
    <div className="relative size-full" data-name="Secure Admin-Controlled Wallet" style={{ backgroundImage: "linear-gradient(148.729deg, rgb(239, 246, 255) 0%, rgb(250, 251, 252) 50%, rgba(219, 234, 254, 0.5) 100%), linear-gradient(90deg, rgb(250, 251, 252) 0%, rgb(250, 251, 252) 100%)" }}>
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="content-stretch flex items-center justify-center relative size-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}