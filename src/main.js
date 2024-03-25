import { createWeb3Modal } from "@web3modal/wagmi/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, fallback, unstable_connector } from "wagmi"
import { createRoot } from "react-dom/client"
import React from "react"
import { createConfig, http } from "wagmi"
import { mainnet, polygon, bsc, sepolia, optimism, base } from "wagmi/chains"

import { injected, walletConnect } from "wagmi/connectors"
import { mainconfig } from "./config"
import App from "./App"

localStorage.clear()

const infuraId = mainconfig.services.infura.key
const alchemyId = mainconfig.services.alchemy.key

const projectId = mainconfig.services.walletconnect.key

const selectedChains = [mainnet, polygon, bsc, optimism, base, sepolia]

const connectors = [
    injected(),
    walletConnect({
        projectId: projectId,
        showQrModal: false
    })
]

const wagmiConfig = createConfig({
    chains: selectedChains,
    transports: {
        [mainnet.id]: fallback([
            unstable_connector(injected),
            http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`)
        ]),
        [sepolia.id]: http(),
        [polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${infuraId}`),
        [bsc.id]: http(),
        [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/SKNZEVz9gLqyHML_rgjwxHTNKf6Fh-cz`),
        [optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${infuraId}`)
    },
    connectors: connectors
})

createWeb3Modal({
    defaultChain: sepolia,
    wagmiConfig: wagmiConfig,
    projectId,
    enableAnalytics: true,
    privacyPolicyUrl: "https://march24.toon.org/privacy",
    excludeWalletIds: [
        "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"
    ],
    themeVariables: {
        "--w3m-accent": "#F79F1F"
    }
})

const queryClient = new QueryClient()

const root = createRoot(document.getElementById("page-container"))

root.render(
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </WagmiProvider>
)
