import {
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimConditions,
  useClaimerProofs,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTokenSupply,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, utils } from "ethers";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { parseIneligibility } from "../utils/parseIneligibility";
import creds from './cred/credentials.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

import React from 'react';


const Home = () => {
  const tokenAddress = "0xf8Bb1882230064CC364b65F4cC61A9F4B4F12869";
  const { contract } = useContract(tokenAddress, "token-drop");
  const address = useAddress();
  // console.log('FIRST COLSOLE LOG', address)
  const [quantity, setQuantity] = useState(1);
  const { data: contractMetadata } = useContractMetadata(contract);
  const [referralAddress, setReferralAddress] = useState('');
  const currentAddress = address;
  const successText = 'text logs only after success';
  const [reffs, setReffs] = useState<number>(0);
  const [referralError, setReferralError] = useState("");



  const writeToGoogleSheets = async (referralAddress: string) => {
    // Check if referralAddress is empty
    if (referralAddress.trim() === '') {
      // Do nothing if referralAddress is empty
      return;
    }
  
    const serviceAccountAuth = new JWT({
      email: `george-wedenin-gmail-com@reff2-402412.iam.gserviceaccount.com`,
      key: `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCqUfq6zZ6lp34I\nmfSsUgrKCzW5KrOwzaJA2RWkWk2K5qVCloS8cUBIishnJC8k+fQ1T3fVe0vb7POt\nw/I3keRknqqY0XDI+0SYDSR62/+fO6yCYlH1g+UXqOrqbiMUroIRXVcFV593j3wy\nd07aAxamFTZmIsPj1qMEmLpmrcxi6q+1iJQNIYKSEei4F4Pc0M3ruyuRttM+t2mY\nxMBia5wuRWXAPPE8K70/FyT2yI1THXdaWEaWd3XttvTfYXl92kaJTtcFMDsUjvhm\nJm/PxmAc8vO2neOTLM7Nsv6A9fPhd2GUHa1AjlIs4dUad+cnB3aAxNVLbt5iB7V3\nm6aiF/h/AgMBAAECggEAOh8stWeqznP4Zf4HyXBb3zPxGuXQGTMrPf72zDXGxXJN\nDgqodFgfbEHz/oKSFge4RyL9zVu8eOoFBBTciQsfyhh9NhYu618Xut2tR8Hgmxm1\nlm7v8h0W5jqOI/7+uLWOjFdydU/ACwBrjRs6zNoF9hpCDJurhoo96jkmTxjbKRvH\nvf+3YtkL64VS2Ip8kFWzhVFZqWEPx+aJPv//EkLvHRMGjimqHRI74wB8ywTQOUax\nuD0kGiZS58KjrsArpbpT/Y/O9DGTbRAhibxZFSZIRjocYcggjShAqHgsyVh/AVVE\nB+J79pBDPSRTSZf2Kq6zebTV6aowMpS4+qDpQV3NXQKBgQDae9xo+5G5eFqttjXY\n1PBMAOCfe4nKonP/dQf6sipRm7uy5aa9lnijiVtaR0sjDx1WCwXo6W1oYPJkNH8l\nQZK/GV7zpAicv2vo2OV1o4C98yJKOIT05Qbff23QGGdLCkU6VSFrJB+tzeC8YPZu\nnG5etKRmQdpmRtPi7B0kJYldWwKBgQDHkO/gebFz9vpYFtqTXeJxkj8FXh2uh+s9\nKMnQn3T5gbchEP2NCxuXnA3mvz6917/4qdC45yTE2FmXK6ZcYv4SsBHPc2UOrjKM\nB9OWvEGKyIfh9Gef6vvmGxOkiFSBl39hTsmS7hZsraATNsaVSE5PTbSk9/ZaAQlB\n1N/k2cdGrQKBgQCnsAEPImZKL7GJOhxB+80iyFmejjbHq7/UBYLGSxBn6ls5h0Fe\nqaqV+cp/k9B7bBJcA8HZba9nOWFQv2oGsjlrKpHR9cgWZmTwJeiXTZJ2N7HNvWtu\neom36BnkaZZ95bgUeVpY3TTjNOyUKOd7Jd0gGw1C3rA9Z4cg14/WOmkfmQKBgQDE\nBxuJfSARD/4yvygu7166PnSHGj6/rKUmq0UqFye42nD/GwhkHhAZaWHCUgMYSbA5\nWt06c1oLvZSrSGYeg+KcirTD+M7Aj9347MsrWnprD7Vh/0g2roSHL/uod33C2gR2\nmgSovhPq5tXBaeHAy4iYn3SdQzCKkk/8iVTwH/d99QKBgQCPMohHGwoJRremi6CU\nZr+9EM3mB4IbnhN6O3kZBBamrQ0sYrN38fSaT6I/oeH+/PXIRuhgV35j9NZxc24H\n8gLDZn7ocUySEuvdpE2F9vf1CNaW3lxN5xNbUNAKDznWx6UBkZAw1aXTv3npRZn6\nw9pIMWrdtNzdphIoCSGw15o6ZQ==\n-----END PRIVATE KEY-----\n`,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
  
    const doc = new GoogleSpreadsheet('11IGd5WV96ziBRZb_w9I9tn0AmtGZ6EjgA8i3N7R-OTA', serviceAccountAuth);
  
    try {
      console.log('Attempting to authorize...');
      await serviceAccountAuth.authorize();
      console.log('Authorization successful.');
  
      console.log('Loading document info...');
      await doc.loadInfo();
      console.log('Document info loaded.');
  
      const sheet = doc.sheetsByIndex[0];
      console.log('Sheet loaded.');
  
      const dataToWrite = {
        Wallet: referralAddress,
        maxClaimable: 1,
      };
  
      const rows = await sheet.getRows();
  
      const existingRow = rows.find((row) => row.get('address') === referralAddress);
      console.log('existingRow', existingRow);
  
      if (existingRow) {
        const currentAmount = Number(existingRow.get('maxClaimable'));
        existingRow.set('maxClaimable', currentAmount + 1);
        await existingRow.save();
      } else {
        await sheet.addRow(dataToWrite);
      }
  
      console.log('Data written to Google Sheets.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const readFromGoogleSheets = async (currentAddress: string) => {
    const serviceAccountAuth = new JWT({
      email: `george-wedenin-gmail-com@reff2-402412.iam.gserviceaccount.com`,
      key: `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCqUfq6zZ6lp34I\nmfSsUgrKCzW5KrOwzaJA2RWkWk2K5qVCloS8cUBIishnJC8k+fQ1T3fVe0vb7POt\nw/I3keRknqqY0XDI+0SYDSR62/+fO6yCYlH1g+UXqOrqbiMUroIRXVcFV593j3wy\nd07aAxamFTZmIsPj1qMEmLpmrcxi6q+1iJQNIYKSEei4F4Pc0M3ruyuRttM+t2mY\nxMBia5wuRWXAPPE8K70/FyT2yI1THXdaWEaWd3XttvTfYXl92kaJTtcFMDsUjvhm\nJm/PxmAc8vO2neOTLM7Nsv6A9fPhd2GUHa1AjlIs4dUad+cnB3aAxNVLbt5iB7V3\nm6aiF/h/AgMBAAECggEAOh8stWeqznP4Zf4HyXBb3zPxGuXQGTMrPf72zDXGxXJN\nDgqodFgfbEHz/oKSFge4RyL9zVu8eOoFBBTciQsfyhh9NhYu618Xut2tR8Hgmxm1\nlm7v8h0W5jqOI/7+uLWOjFdydU/ACwBrjRs6zNoF9hpCDJurhoo96jkmTxjbKRvH\nvf+3YtkL64VS2Ip8kFWzhVFZqWEPx+aJPv//EkLvHRMGjimqHRI74wB8ywTQOUax\nuD0kGiZS58KjrsArpbpT/Y/O9DGTbRAhibxZFSZIRjocYcggjShAqHgsyVh/AVVE\nB+J79pBDPSRTSZf2Kq6zebTV6aowMpS4+qDpQV3NXQKBgQDae9xo+5G5eFqttjXY\n1PBMAOCfe4nKonP/dQf6sipRm7uy5aa9lnijiVtaR0sjDx1WCwXo6W1oYPJkNH8l\nQZK/GV7zpAicv2vo2OV1o4C98yJKOIT05Qbff23QGGdLCkU6VSFrJB+tzeC8YPZu\nnG5etKRmQdpmRtPi7B0kJYldWwKBgQDHkO/gebFz9vpYFtqTXeJxkj8FXh2uh+s9\nKMnQn3T5gbchEP2NCxuXnA3mvz6917/4qdC45yTE2FmXK6ZcYv4SsBHPc2UOrjKM\nB9OWvEGKyIfh9Gef6vvmGxOkiFSBl39hTsmS7hZsraATNsaVSE5PTbSk9/ZaAQlB\n1N/k2cdGrQKBgQCnsAEPImZKL7GJOhxB+80iyFmejjbHq7/UBYLGSxBn6ls5h0Fe\nqaqV+cp/k9B7bBJcA8HZba9nOWFQv2oGsjlrKpHR9cgWZmTwJeiXTZJ2N7HNvWtu\neom36BnkaZZ95bgUeVpY3TTjNOyUKOd7Jd0gGw1C3rA9Z4cg14/WOmkfmQKBgQDE\nBxuJfSARD/4yvygu7166PnSHGj6/rKUmq0UqFye42nD/GwhkHhAZaWHCUgMYSbA5\nWt06c1oLvZSrSGYeg+KcirTD+M7Aj9347MsrWnprD7Vh/0g2roSHL/uod33C2gR2\nmgSovhPq5tXBaeHAy4iYn3SdQzCKkk/8iVTwH/d99QKBgQCPMohHGwoJRremi6CU\nZr+9EM3mB4IbnhN6O3kZBBamrQ0sYrN38fSaT6I/oeH+/PXIRuhgV35j9NZxc24H\n8gLDZn7ocUySEuvdpE2F9vf1CNaW3lxN5xNbUNAKDznWx6UBkZAw1aXTv3npRZn6\nw9pIMWrdtNzdphIoCSGw15o6ZQ==\n-----END PRIVATE KEY-----\n`,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
    
    const doc = new GoogleSpreadsheet('11IGd5WV96ziBRZb_w9I9tn0AmtGZ6EjgA8i3N7R-OTA', serviceAccountAuth);
  
    try {
      console.log('Attempting to authorize...');
      try {
        await serviceAccountAuth.authorize();
      } catch (error) {
        console.error('Error during authorization:', error);
      }
      console.log('Authorization successful.');
      console.log('Loading document info...');
      await doc.loadInfo();
      console.log('Document info loaded.');
      const sheet = doc.sheetsByIndex[0];
      console.log('Sheet loaded.');
      const rows = await sheet.getRows();
      console.log('IERNONIGR', currentAddress)
      const matchingRow = await rows.find(async (row) => row.get('address') === currentAddress);
      console.log('matchingRow', matchingRow);
      console.log('IERNONIGR', currentAddress);
      const findMatchingRow = async () => {
        const matchingRow = await Promise.all(rows.map(async (row) => {
          const wallet = await row.get('address');
          const referrals = await row.get('maxClaimable');
          if (wallet === currentAddress) {
            console.log('Matching Wallet:', wallet);
            console.log('Amount of Referrals:', referrals);
            setReffs(referrals);
            return true;
          }
          return false;
        }));
        if (!matchingRow.includes(true)) {
          console.log('No matching row found.');
        }
      };
      findMatchingRow();
      if (matchingRow) {
        const amount = Number(matchingRow.get('maxClaimable'));
        console.log('AMAAAAAAAAAAAAAAAUNT', amount);
      } else {
        console.log('No matching row found');
      }
      console.log(matchingRow);
      console.log('Data written to Google Sheets.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (currentAddress) {
      readFromGoogleSheets(currentAddress);
    }
  }, [currentAddress]);

 const [referralData, setReferralData] = useState<{ recipient: string; amount: number }[]>([]);

 function addOrUpdateReferral(address: string) {

   const existingReferralIndex = referralData.findIndex((item) => item.recipient === address);

   if (existingReferralIndex !== -1) {
     const updatedReferralData = [...referralData];
     updatedReferralData[existingReferralIndex].amount += 1;
     setReferralData(updatedReferralData);
   } else {
     setReferralData([...referralData, { recipient: address, amount: 1 }]);
   }
 }

  const claimConditions = useClaimConditions(contract);
  const activeClaimCondition = useActiveClaimConditionForWallet(
    contract,
    address
  );
  const claimerProofs = useClaimerProofs(contract, address || "");
  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity,
    walletAddress: address || "",
  });

  const claimedSupply = useTokenSupply(contract);

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data?.value || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(
      BigNumber.from(claimedSupply.data?.value || 0)
    );
    if (n.gte(1_000_000_000)) {
      return "";
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const priceToMint = useMemo(() => {
    if (quantity) {
      const bnPrice = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      return `${utils.formatUnits(
        bnPrice.mul(quantity).toString(),
        activeClaimCondition.data?.currencyMetadata.decimals || 18
      )} ${activeClaimCondition.data?.currencyMetadata.symbol}`;
    }
  }, [
    activeClaimCondition.data?.currencyMetadata.decimals,
    activeClaimCondition.data?.currencyMetadata.symbol,
    activeClaimCondition.data?.currencyMetadata.value,
    quantity,
  ]);

  const maxClaimable = useMemo(() => {
    let bnMaxClaimable;
    try {
      bnMaxClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimableSupply || 0
      );
    } catch (e) {
      bnMaxClaimable = BigNumber.from(1_000_000_000);
    }

    let perTransactionClaimable;
    try {
      perTransactionClaimable = BigNumber.from(
        activeClaimCondition.data?.maxClaimablePerWallet || 0
      );
    } catch (e) {
      perTransactionClaimable = BigNumber.from(1_000_000_000);
    }

    if (perTransactionClaimable.lte(bnMaxClaimable)) {
      bnMaxClaimable = perTransactionClaimable;
    }

    const snapshotClaimable = claimerProofs.data?.maxClaimable;

    if (snapshotClaimable) {
      if (snapshotClaimable === "0") {
        bnMaxClaimable = BigNumber.from(1_000_000_000);
      } else {
        try {
          bnMaxClaimable = BigNumber.from(snapshotClaimable);
        } catch (e) {
        }
      }
    }

    let max;
    if (totalAvailableSupply.lt(bnMaxClaimable)) {
      max = totalAvailableSupply;
    } else {
      max = bnMaxClaimable;
    }

    if (max.gte(1_000_000_000)) {
      return 1_000_000_000;
    }
    return max.toNumber();
  }, [
    claimerProofs.data?.maxClaimable,
    totalAvailableSupply,
    activeClaimCondition.data?.maxClaimableSupply,
    activeClaimCondition.data?.maxClaimablePerWallet,
  ]);

  const isSoldOut = useMemo(() => {
    try {
      return (
        (activeClaimCondition.isSuccess &&
          BigNumber.from(activeClaimCondition.data?.availableSupply || 0).lte(
            0
          )) ||
        numberClaimed === numberTotal
      );
    } catch (e) {
      return false;
    }
  }, [
    activeClaimCondition.data?.availableSupply,
    activeClaimCondition.isSuccess,
    numberClaimed,
    numberTotal,
  ]);

  const canClaim = useMemo(() => {
    return (
      activeClaimCondition.isSuccess &&
      claimIneligibilityReasons.isSuccess &&
      claimIneligibilityReasons.data?.length === 0 &&
      !isSoldOut
    );
  }, [
    activeClaimCondition.isSuccess,
    claimIneligibilityReasons.data?.length,
    claimIneligibilityReasons.isSuccess,
    isSoldOut,
  ]);

  const isLoading = useMemo(() => {
    return activeClaimCondition.isLoading || !contract;
  }, [activeClaimCondition.isLoading, contract]);

  const buttonLoading = useMemo(
    () => isLoading || claimIneligibilityReasons.isLoading,
    [claimIneligibilityReasons.isLoading, isLoading]
  );
  const buttonText = useMemo(() => {
    if (isSoldOut) {
      return "Sold Out";
    }

    if (canClaim) {
      const pricePerToken = BigNumber.from(
        activeClaimCondition.data?.currencyMetadata.value || 0
      );
      if (pricePerToken.eq(0)) {
        return "Mint (Free)";
      }
      return `Mint (${priceToMint})`;
    }
    if (claimIneligibilityReasons.data?.length) {
      return parseIneligibility(claimIneligibilityReasons.data, quantity);
    }
    if (buttonLoading) {
      return "Checking eligibility...";
    }

    return "Claiming not available";
  }, [
    isSoldOut,
    canClaim,
    claimIneligibilityReasons.data,
    buttonLoading,
    activeClaimCondition.data?.currencyMetadata.value,
    priceToMint,
    quantity,
  ]);

  return (
    <div className={styles.container}>
      {(claimConditions.data &&
        claimConditions.data.length > 0 &&
        activeClaimCondition.isError) ||
        (activeClaimCondition.data &&
          activeClaimCondition.data.startTime > new Date() && (
            <p>Drop is starting soon. Please check back later.</p>
          ))}

      {claimConditions.data?.length === 0 ||
        (claimConditions.data?.every((cc) => cc.maxClaimableSupply === "0") && (
          <p>
            This drop is not ready to be minted yet. (No claim condition set)
          </p>
        ))}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {contractMetadata?.image && (
            <Image
              src={contractMetadata?.image}
              alt={contractMetadata?.name!}
              width={200}
              height={200}
              style={{ objectFit: "contain" }}
            />
          )}

          <h2 className={styles.title}>Claim Tokens</h2>
          <p className={styles.explain}>
            Claim ERC20 tokens from{" "}
            <span className={styles.pink}>{contractMetadata?.name}</span>
          </p>
        </>
      )}

      <hr className={styles.divider} />

      <div className="grid justify-items-center gap-3">
        <input
          type="number"
          placeholder="Enter amount to claim"
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > maxClaimable) {
              setQuantity(maxClaimable);
            } else if (value < 1) {
              setQuantity(1);
            } else {
              setQuantity(value);
            }
          }}
          value={quantity}
          className="w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0"
        />


<input
  type="text"
  placeholder="Your referral"
  value={referralAddress}
  onChange={(e) => {
    const inputValue = e.target.value;
    setReferralAddress(inputValue);

    // Validation checks
    if (inputValue !== "" && !inputValue.startsWith("0x")) {
      setReferralError("Referral address must start with '0x'");
    } else if (inputValue !== "" && inputValue.length !== 42) {
      setReferralError("Referral address must be 42 characters long");
    } else if (inputValue !== "" && inputValue === currentAddress) {
      setReferralError("Referral address cannot be the same as the current address");
    } else {
      setReferralError(""); // Clear error if input is valid or empty
    }
  }}
  className={`w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0 ${referralError ? "border-red-500" : ""}`}
/>
{referralError && <div className="text-red-500">{referralError}</div>}

      <Web3Button
        theme="dark"
        contractAddress={tokenAddress}
        isDisabled={referralError !== ""}
        action={async (contract) => {
          await contract.erc20.claim(quantity);
        }}
        onSuccess={async () => {
          addOrUpdateReferral(referralAddress); // Update referral data array
          console.log(referralData);
          console.log(successText);
          writeToGoogleSheets(referralAddress);
        }}
        onError={(err) => alert(err)}
      >
        {buttonText}
      </Web3Button>
 
      <div className="w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0"> 
        <p>Your address</p>
        <p>{currentAddress}</p>
      </div>     
      <div className="w-[100%] bg-transparent border border-gray-300 rounded-lg text-white h-12 px-4 text-base mb-0">
        <p>Your referrals</p>
        {reffs !== null ? <p>{reffs}</p> : <p>Loading...</p>}
      </div>
      </div>
    </div>
  );
};

export default Home;
