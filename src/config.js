import { sepolia, base, optimism } from "wagmi/chains"

const isProduction = true

let injectedProvider = false

if (typeof window.ethereum !== "undefined") {
    injectedProvider = true
}



const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false
export const supportedChains = [1, 56, 137, 8453, 10, 11155111]
// export const supportedChains = [1, 56, 137, 42161, 11155111]

export const mainconfig = {
    isProduction,
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isAndroid: /android/i.test(navigator.userAgent),
    isMobile: /iphone|ipad|android/i.test(window.navigator.userAgent),
    isMetaMaskOld: /metamask/i.test(window.navigator.userAgent), // testing whether the user's browser is running the MetaMask extension
    isMetaMask,
    ethAmountQueryKey: "eth_amount",
    services: {
        walletconnect: {
            key: "4cd88eccff96593e3a6ef5c600e8350c"
        },
        infura: {
            key: "9dac313413d04fa2945eb7ffeec43b03"
        },
        alchemy: {
            key: "wg6wp8N_jgPqBLyx94PxLRrNLVer2Elb"
        },
        amplitude: {
            // EARLY ACCESS AMPLITUDE ORG
            key: "2acf973b95c5ee353d8e6f90f2b76cf9"
        }
    }
}

export const NFTcontracts = {
    11155111: "0x366499256bb1b692B94adab526f3cc9DA30F1A8d",
    1: "0x49cC7de889C1e4bDc1b4156B882cA5c76C668987",
    137: "0xA42ccA468fd07491824Ab121CB559f1B3791e92C",
    56: "0xFA17c9e4f5Ec1A62d032731fE0a9529D7B851BE6",
    10: "0x7A34e3e17Cf4cf18B3d9046eA0685e1b7dC32a2c",
    8453: "0xB6763731f5CB6836c6Ab2f82De3DE64292AdA234"
}

export const FreeAbi = [
    {
        name: "mint",
        type: "function",
        stateMutability: "payable",
        inputs: [
            {
                internalType: "uint256",
                name: "_mintAmount",
                type: "uint256"
            }
        ],
        outputs: []
    }
]

export const PayableAbi = [
    {
        name: "mintPayable",
        type: "function",
        stateMutability: "payable",
        inputs: [
            {
                internalType: "uint256",
                name: "_mintAmount",
                type: "uint256"
            }
        ],
        outputs: []
    }
]

const differentAbiChains = [sepolia.id, optimism.id, base.id]
export const getAbi = (chainId, option) => {
    if (differentAbiChains.includes(chainId) && option === "option1") {
        return PayableAbi
    }
    return FreeAbi
}

export const getFunctionName = (chainId, option) => {
    if (differentAbiChains.includes(chainId) && option === "option1") {
        return "mintPayable"
    }
    return "mint"
}
