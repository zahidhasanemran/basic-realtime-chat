"use client"

import { useEffect, useState } from "react"
import { ANIMALS, STORAGE_KEY } from "@/lib/constants"
import { generateUsername } from "@/lib/utils"


export const useUsername = () => {
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    const main = () => {
      const storedUsername = localStorage.getItem(STORAGE_KEY)
      if (storedUsername) {
        setUsername(storedUsername)
        return
      }

      const newUsername = generateUsername(ANIMALS)
      localStorage.setItem(STORAGE_KEY, newUsername)
      setUsername(newUsername)
    }

    main()
  }, [])

  return {username}
}