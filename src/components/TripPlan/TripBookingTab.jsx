import { card, sectionLabel, bookingLink } from "./SharedUI"
import { getTransportLinks, getStayLinks } from "../../utils/tripPlanUtils"

export const TripBookingTab = ({ theme, transport, stayType, locationName }) => {
  const transportLinks = getTransportLinks(transport, locationName)
  const stayLinks = getStayLinks(stayType)

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Transport */}
      {card(theme, <>
        {sectionLabel(theme, `🚌 BOOK YOUR ${transport?.toUpperCase()}`)}
        {transportLinks.map((item, i) => bookingLink(theme, item, i, transportLinks.length))}
      </>)}

      {/* Stay */}
      {card(theme, <>
        {sectionLabel(theme, `🏨 BOOK YOUR ${stayType?.toUpperCase()}`)}
        {stayLinks.map((item, i) => bookingLink(theme, item, i, stayLinks.length))}
      </>)}
    </div>
  )
}
