import React from "react"
import { parseUnits } from "viem"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { NFTcontracts, getAbi, getFunctionName } from "./config"
import { useWeb3Modal } from "@web3modal/wagmi/react"

const App = () => {
    const { open } = useWeb3Modal()

    const { isConnected, chain } = useAccount()

    const {
        writeContract,
        data: hash,
        isPending
    } = useWriteContract({
        mutation: {
            onSuccess() {
                console.log("Success write", hash)
            },
            onError(err) {
                console.log("Error write", err)
            }
        }
    })

    const {
        error: transError,
        isError: isTransError,
        isLoading: isConfirming,
        isSuccess: isConfirmed
    } = useWaitForTransactionReceipt({
        hash,
        chainId: chain?.id,
        query: {
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div>
            {isConnected ? (
                <w3m-account-button balance={false} />
            ) : (
                <button type="button" onClick={() => open()}>
                    Connect Wallet
                </button>
            )}

            {isConnected && (
                <div>
                    <h3>Mint NFT</h3>
                    <button
                        type="button"
                        onClick={() =>
                            writeContract({
                                address: NFTcontracts[chain?.id],
                                abi: getAbi(chain?.id, "option1"),
                                args: ["1"],
                                value: parseUnits("1", 18),
                                functionName: getFunctionName(chain?.id, "option1")
                            })
                        }
                    >
                        Mint
                    </button>
                    {isPending && <p>isPending</p>}
                    {isConfirming && <p>isPending</p>}
                    {isConfirmed && <p>isConfirmed</p>}

                    {isTransError && <p>{transError}</p>}
                </div>
            )}
        </div>
    )
}

export default App
