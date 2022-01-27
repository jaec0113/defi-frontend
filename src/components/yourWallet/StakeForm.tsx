import { useState, useEffect } from "react"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { utils } from "ethers"
import { Token } from "../Main"
import { useStakeTokens } from "../../hooks/useStakeTokens"

export interface StakeFormProps {
  token: Token
}

export default function StakeForm({ token }: StakeFormProps) {
  const { address: tokenAddress, name } = token
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(tokenAddress, account)
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0
  const { notifications } = useNotifications()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value === "" ? "" : Number(e.target.value)
    setAmount(newAmount)
  }

  const { approveAndStake, state: approveAndStakeErc20State } =
    useStakeTokens(tokenAddress)
  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0)

  const isMining = approveAndStakeErc20State.status === "Mining"
  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] =
    useState(false)
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)

  const handleCloseSnackbar = () => {
    setShowErc20ApprovalSuccess(false)
    setShowStakeTokenSuccess(false)
  }

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve ERC20 transfer"
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(true)
      setShowStakeTokenSuccess(false)
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Stake Tokens"
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(false)
      setShowStakeTokenSuccess(true)
    }
  }, [notifications, setShowErc20ApprovalSuccess, setShowStakeTokenSuccess])

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString())
    return approveAndStake(amountAsWei.toString())
  }

  return (
    <>
      <div>
        <Input onChange={handleInputChange} />
        <Button
          onClick={handleStakeSubmit}
          color='primary'
          size='large'
          disabled={isMining}
        >
          {isMining} ? <CircularProgress size={26} /> : "Stake!"
        </Button>
      </div>
      <Snackbar
        open={showErc20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          ERC-20 token transfer approved! Now approve the second transaction.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          Tokens staked!
        </Alert>
      </Snackbar>
    </>
  )
}
