'use babel'

export default function (seconds) {
  if (seconds == null || +seconds !== seconds) return '--:--'

  const min = Math.floor(seconds / 60)
  const sec = seconds - 60 * min
  return ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2)
}
