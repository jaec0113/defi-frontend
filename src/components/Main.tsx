import { useEthers } from "@usedapp/core"
import { constants } from "ethers"
import { makeStyles } from "@material-ui/core"
import YourWallet from "./yourWallet/YourWallet"
import helperConfig from "../helperConfig.json"
import networkMapping from "../chain-info/deployments/map.json"
import brownieConfig from "../brownie-config.json"
import dappLogo from "../images/dapp.png"
import ethLogo from "../images/eth-logo.png"
import daiLogo from "../images/dai.png"

export type Token = {
  image: string
  address: string
  name: string
}

export default function Main() {
  const classes = useStyles()
  const { chainId, error } = useEthers()
  const networkName = chainId ? helperConfig[chainId] : "dev"
  const dappTokenAddress = chainId
    ? networkMapping[String(chainId)]["DappToken"][0]
    : constants.AddressZero
  const wethTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["weth_token"]
    : constants.AddressZero
  const fauTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["fau_token"]
    : constants.AddressZero

  const supportedTokens: Array<Token> = [
    {
      image: dappLogo,
      address: dappTokenAddress,
      name: "DAPP",
    },
    {
      image: ethLogo,
      address: wethTokenAddress,
      name: "WETH",
    },
    {
      image: daiLogo,
      address: fauTokenAddress,
      name: "DAI",
    },
  ]

  return (
    <>
      <h2 className={classes.title}>Dapp Token App</h2>
      <YourWallet supportedTokens={supportedTokens} />
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4),
  },
}))
