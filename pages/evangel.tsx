import Head from "next/head"
import { StoreProvider } from "easy-peasy"

import { EvangelMap } from "../components/EvangelMap"
import { store } from "../components/EvangelMap/store"

const AIRTABLE_IDS = {
  DRIVERS_TABLE: process.env.NEXT_PUBLIC_AIRTABLE_DRIVERS_TABLE_ID,
  DRIVERS_VIEW: process.env.NEXT_PUBLIC_AIRTABLE_DRIVERS_MAP_VIEW_ID,
  RECIPIENTS_TABLE: process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_TABLE_ID,
  RECIPIENTS_VIEW: process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_MAP_VIEW_ID,
}

const Evangel: React.FC = () => {
  return (
    <>
      <Head>
        <title>QDSAMA: Evangel</title>
      </Head>

      <StoreProvider store={store}>
        <EvangelMap
          driversViewID={AIRTABLE_IDS.DRIVERS_VIEW}
          recipientsViewID={AIRTABLE_IDS.RECIPIENTS_VIEW}
        />
      </StoreProvider>
    </>
  )
}

export default Evangel
