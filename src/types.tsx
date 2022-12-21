interface NativeCurrency {
    name: string,
    symbol: string,
    decimals: number
}

interface IChain {
    id: string,
    name: string,
    rpcUrls: string[],
    blockExploreUrls: string[],
    nativeCurrency: NativeCurrency,
    icon: any,
    scanContractUrl: (_: string) => string,
    scanAddressUrl: (_: string) => string,
    scanAbiUrl: (_: string) => string
}

export class Chain implements IChain {
    id: string
    name: string
    rpcUrls: string[]
    blockExploreUrls: string[]
    nativeCurrency: NativeCurrency
    icon: any
    scanContractUrl: (_: string) => string
    scanAddressUrl: (_: string) => string
    scanAbiUrl: (_: string) => string

    constructor(props: IChain) {
        this.id = props.id
        this.name = props.name
        this.rpcUrls = props.rpcUrls
        this.blockExploreUrls = props.blockExploreUrls
        this.nativeCurrency = props.nativeCurrency
        this.icon = props.icon
        this.scanContractUrl = props.scanContractUrl
        this.scanAddressUrl = props.scanAddressUrl
        this.scanAbiUrl = props.scanAbiUrl
    }
}

interface IProject {
    name: string,
    icon: any,
    governorAddress: string,
    arbitratorAddress: string,
    snapshotSlug: string,
    chain: Chain,
}

export class Project implements IProject {
    name: string
    icon: any
    governorAddress: string
    arbitratorAddress: string
    snapshotSlug: string
    chain: Chain

    constructor(props: IProject) {
        this.name = props.name
        this.icon = props.icon
        this.governorAddress = props.governorAddress
        this.arbitratorAddress = props.arbitratorAddress
        this.snapshotSlug = props.snapshotSlug
        this.chain = props.chain
    }

}
