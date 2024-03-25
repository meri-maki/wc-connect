
export const preventScroll = () => (document.documentElement.style.overflow = "hidden")
export const enableScroll = () => (document.documentElement.style.overflow = "inherit")

export const toElement = (ref) => {
    if (!ref.current) {
        return
    }
    const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY - 100

    window.scroll({
        top: elementPosition,
        behavior: "smooth"
    })
}

export const toNFT = () => {
    const NFT = document.getElementById("mintID")
    if (!NFT) {
        console.error("Element not found.")
        return
    }
    const elementPosition = NFT.getBoundingClientRect().top + window.scrollY - 100
    window.scroll({
        top: elementPosition,
        behavior: "smooth"
    })
}

export const onPageLoad = () => {
    const eventParams = {
        full: window.location.href,
        host: window.location.host,
        path: window.location.path,
        queryString: window.location.search
    }

}
