import { Flex } from "@chakra-ui/react"
import ListActionBar from "./utils/ListActionBar"
import ChatsList from "./utils/ChatsList"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setUserChats } from "../../../redux/slices/chats"
import { fetchUserChatsList } from "../../../api/chats"
import { useLocalStorage } from "../../../hooks/useLocalStorage"

function LeftPanel() {

  const dispatch = useDispatch()

  const {getItem} = useLocalStorage()

  useEffect( () => {
    const getUserChats = async() => {
      dispatch(setUserChats(await fetchUserChatsList(getItem("chatAppUser"))))
    }

    getUserChats()
    //eslint-disable-next-line
  }, [] )

  return (
    <Flex direction="column" w="100%" >
        {/* Top Action bar */}
        <ListActionBar />
        {/* Chats Display List */}
        <ChatsList />
    </Flex>
  )
}

export default LeftPanel