import {
    useSetClaimConditions,
    useContract,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
  // Your smart contract address
  const contractAddress = "0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869";
  
  function App() {
    const { contract } = useContract(contractAddress);
    const {
      mutateAsync: setClaimConditions,
      isLoading,
      error,
    } = useSetClaimConditions(contract);
  
    return (
      <Web3Button
        contractAddress={contractAddress}
        action={() =>
          setClaimConditions({
            phases: [
              {
                metadata: {
                  name: "Phase 1", // The name of the phase
                },
                currencyAddress: NATIVE_TOKEN_ADDRESS, // The address of the currency you want users to pay in
                price: 0, // The price of the token in the currency specified above
                maxClaimablePerWallet: 0, // The maximum number of tokens a wallet can claim
                maxClaimableSupply: 100, // The total number of tokens that can be claimed in this phase
                startTime: new Date(), // When the phase starts (i.e. when users can start claiming tokens)
                waitInSeconds: 60 * 60 * 24 * 7, // The period of time users must wait between repeat claims
                // snapshot: [
                //   {
                //     address: "0x...", // The address of the wallet
                //     currencyAddress: "0x...", // Override the currency address this wallet pays in
                //     maxClaimable: 5, // Override the maximum number of tokens this wallet can claim
                //     price: 0.5, // Override the price this wallet pays
                //   },
                // ],
                // merkleRootHash: "0x...", // The merkle root hash of the snapshot
              },
            ],
          })
        }
      >
        Set Claim Conditions
      </Web3Button>
    );
  }

  export default App