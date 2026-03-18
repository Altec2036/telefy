export type Lang = "en" | "ru";

export function normalizeLang(input?: string | null): Lang {
  return input === "ru" ? "ru" : "en";
}

type Dict = {
  siteName: string;
  description: string;
  sectionsHint: string;
  dashboard: string;
  eth: string;
  tokens: string;
  uniswap: string;
  network: string;
  mainnet: string;
  totalBalanceUsd: string;
  addressPrefix: string;
  status: string;
  activeDefi: string;
  updatedAt: string;
  trackedTokens: string;
  trackedTokensSubtitle: string;
  noAddressHint: string;
  enterAddress: string;
  showPortfolio: string;
  loading: string;
  invalidAddress: string;
  invalidAddressHint: string;
  tokensNotFound: string;
  liquidityNotFound: string;
  startTourTitle: string;
  startTourDesc: string;
  skip: string;
  startTour: string;
  tourAddressTitle: string;
  tourAddressDesc: string;
  tourSummaryTitle: string;
  tourSummaryDesc: string;
  tourTokensTitle: string;
  tourTokensDesc: string;
  tourLiquidityTitle: string;
  tourLiquidityDesc: string;
  next: string;
  prev: string;
  done: string;
  lightTheme: string;
  darkTheme: string;
};

export const I18N: Record<Lang, Dict> = {
  en: {
    siteName: "Web3 Portfolio Dashboard",
    description: "ETH, ERC-20 and Uniswap V2/V3 with accurate USD valuation.",
    sectionsHint: "Dashboard sections. Click to jump to a block.",
    dashboard: "Dashboard",
    eth: "ETH",
    tokens: "ERC-20",
    uniswap: "Uniswap",
    network: "Network",
    mainnet: "Ethereum Mainnet",
    totalBalanceUsd: "Total Balance USD",
    addressPrefix: "Address",
    status: "Status",
    activeDefi: "Active DeFi positions",
    updatedAt: "Updated",
    trackedTokens: "Tracked tokens",
    trackedTokensSubtitle: "Visible ERC-20 balances",
    noAddressHint: "Enter an address to load real portfolio values",
    enterAddress: "Enter Ethereum address (0x...)",
    showPortfolio: "Show portfolio",
    loading: "Loading...",
    invalidAddress: "Invalid Ethereum address",
    invalidAddressHint: "Use format 0x... with 42 chars. Case is not strict.",
    tokensNotFound: "No tracked tokens found.",
    liquidityNotFound: "No liquidity positions found.",
    startTourTitle: "Mini onboarding",
    startTourDesc: "Show a short guided tour with hints for the main blocks?",
    skip: "Skip",
    startTour: "Start tour",
    tourAddressTitle: "Wallet address",
    tourAddressDesc: "Paste any Ethereum address to load ETH, ERC-20 and Uniswap positions.",
    tourSummaryTitle: "Portfolio summary",
    tourSummaryDesc: "Main card with total USD and an animated portfolio curve.",
    tourTokensTitle: "ERC-20 tokens",
    tourTokensDesc: "Token balances, current prices and USD valuation.",
    tourLiquidityTitle: "Uniswap V2/V3",
    tourLiquidityDesc: "LP positions with range status and fees.",
    next: "Next",
    prev: "Back",
    done: "Done",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
  },
  ru: {
    siteName: "Web3 Portfolio Dashboard",
    description: "ETH, ERC-20 и Uniswap V2/V3 с точной USD оценкой.",
    sectionsHint: "Разделы дашборда. Нажмите, чтобы перейти к блоку.",
    dashboard: "Дашборд",
    eth: "ETH",
    tokens: "ERC-20",
    uniswap: "Uniswap",
    network: "Сеть",
    mainnet: "Ethereum Mainnet",
    totalBalanceUsd: "Общий баланс USD",
    addressPrefix: "Адрес",
    status: "Статус",
    activeDefi: "Активных DeFi позиций",
    updatedAt: "Обновлено",
    trackedTokens: "Отслеживаемые токены",
    trackedTokensSubtitle: "Видимые ERC-20 балансы",
    noAddressHint: "Введите адрес, чтобы загрузить реальные значения портфеля",
    enterAddress: "Введите Ethereum-адрес (0x...)",
    showPortfolio: "Показать портфель",
    loading: "Загрузка...",
    invalidAddress: "Невалидный Ethereum адрес",
    invalidAddressHint: "Используйте формат 0x... длиной 42 символа. Регистр не важен.",
    tokensNotFound: "Токены не найдены.",
    liquidityNotFound: "Позиции ликвидности не найдены.",
    startTourTitle: "Мини-обучение",
    startTourDesc: "Показать короткий тур с подсказками по основным блокам дашборда?",
    skip: "Пропустить",
    startTour: "Начать тур",
    tourAddressTitle: "Адрес кошелька",
    tourAddressDesc: "Вставьте Ethereum-адрес, чтобы загрузить ETH, ERC-20 и Uniswap позиции.",
    tourSummaryTitle: "Сводка портфеля",
    tourSummaryDesc: "Главная карточка с итогом в USD и анимированной кривой.",
    tourTokensTitle: "ERC-20 токены",
    tourTokensDesc: "Баланс токенов, текущая цена и итоговая USD оценка.",
    tourLiquidityTitle: "Uniswap V2/V3",
    tourLiquidityDesc: "LP позиции с диапазоном и начисленными комиссиями.",
    next: "Далее",
    prev: "Назад",
    done: "Готово",
    lightTheme: "Светлая тема",
    darkTheme: "Темная тема",
  },
};
