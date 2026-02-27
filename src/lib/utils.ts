import { nanoid } from "nanoid"
import { ANIMALS } from "./constants"

export const generateUsername = (animals: typeof ANIMALS = ANIMALS) => {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `anonymous_${animal}-${nanoid(5)}`
} 


export const copyToClipboard = async () => {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    console.log(error)
  }
}


export const formatTimeRemaining = (remainingTime: number) => {
  const mins = Math.floor(remainingTime / 60);
  const secs = remainingTime % 60;
  return `${mins}:${(secs).toString().padStart(2, "0")}`
}