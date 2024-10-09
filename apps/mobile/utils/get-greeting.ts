export function getGreeting() {
  const now =  new Date()
  const hours = now.getHours()

  if (hours < 12) {
    return 'Good Morning'
  }

  if (hours < 19) {
    return 'Good Afternoon'
  }

  if (hours < 22) {
    return 'Good Evening'
  }

  return 'Good Night'
}