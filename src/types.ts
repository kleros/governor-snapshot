import { ReactNode } from "react"

interface NativeCurrency {
    name: string,
    symbol: string,
    decimals: number
}

export interface Chain {
    id: string,
    name: string,
    rpcUrls: string[],
    blockExplorerUrls: string[],
    nativeCurrency: NativeCurrency,
    icon: ReactNode,
    scanContractUrl: (_: string) => string,
    scanAddressUrl: (_: string) => string,
    scanAbiUrl: (_: string) => string
}

export interface Project {
    name: string,
    icon: ReactNode,
    governorAddress: string,
    arbitratorAddress: string,
    snapshotSlug: string,
    chain: Chain,
}

export interface Session {
    currentSessionNumber: number,
    disputeID: number
}

export interface Dispute {
    subcourtId: number,
    arbitrated: string,
    numberOfChoices: number,
    period: number,
    lastPeriodChange: number,
    drawsInRound: number,
    commitsInRound: number,
    ruled: boolean
}

export interface AppealPeriod {
    start: number,
    end: number
}

export interface RoundInfo {
    paidFees: number[],
    hasPaid: boolean[],
    feeRewards: number,
    successfullyPaid: number
}

export interface Transaction {
    data: string,
    address: string,
    value: number,
    title: string
}

export interface ProjectParams {
    path: string,
    url: string,
    isExact: boolean,
    params: {
        projectName: string
    }
}

export interface SubmissionList {
    submitter: string,
    submittedAt: Date,
    txs: Transaction[],
    listID: string
}

export interface Method {
    name: string,
    inputs: any,
    constant?: boolean
}

export interface MethodInput {
    name: string,
    type: string
}
