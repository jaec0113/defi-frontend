import React, { useState } from "react"
import { Token } from "../Main"
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import WalletBalance from "./WalletBalance"
import StakeForm from "./StakeForm"

interface YourWalletProps {
  supportedTokens: Array<Token>
}

export default function YourWallet({ supportedTokens }: YourWalletProps) {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue))
  }

  const classes = useStyles()

  return (
    <Box>
      <h1 className={classes.header}>Your Wallet!</h1>
      <Box className={classes.box}>
        <TabContext value={selectedTokenIndex.toString()}>
          <TabList onChange={handleChange} aria-label='stake form tabs'>
            {supportedTokens.map((token, index) => {
              return (
                <Tab label={token.name} value={index.toString()} key={index} />
              )
            })}
          </TabList>
          {supportedTokens.map((token, index) => {
            return (
              <TabPanel value={index.toString()} key={index}>
                <div className={classes.tabContent}>
                  <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                  <StakeForm token={supportedTokens[selectedTokenIndex]} />
                </div>
              </TabPanel>
            )
          })}
        </TabContext>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
  },
  header: {
    color: "white",
  },
}))
