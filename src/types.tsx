export interface Chain {
    id: string,
    name: string,
    rpcUrls: string[],
    blockExploreUrls: string[],
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    icon: React.FC,
    scanContractUrl: (_: string) => string,
    scanAddressUrl: (_: string) => string,
    scanAbiUrl: (_: string) => string
}
