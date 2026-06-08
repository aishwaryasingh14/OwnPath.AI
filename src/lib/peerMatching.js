export function findPeerMatch(participant, allParticipants) {
  const participantBarriers = participant.reportedBarriers || [];

  const searchText = (p) =>
    `${p.story || ""} ${p.recoveryNote || ""} ${(p.reportedBarriers || []).join(" ")}`.toLowerCase();

  // Priority 1: has a recovery note + shares a barrier + further along in program
  const recoveryMatches = allParticipants.filter(p =>
    p.id !== participant.id &&
    p.recoveryNote &&
    p.currentWeek >= participant.currentWeek &&
    participantBarriers.some(b => searchText(p).includes(b))
  );

  if (recoveryMatches.length > 0) {
    recoveryMatches.sort((a, b) => {
      const aShared = participantBarriers.filter(b => searchText(a).includes(b)).length;
      const bShared = participantBarriers.filter(b => searchText(b).includes(b)).length;
      return bShared - aShared ||
        Math.abs(a.currentWeek - participant.currentWeek) - Math.abs(b.currentWeek - participant.currentWeek);
    });
    return recoveryMatches[0];
  }

  // Priority 2: further along, no missed days, opted into some support
  return allParticipants.find(p =>
    p.id !== participant.id &&
    p.currentWeek > participant.currentWeek &&
    p.missedDays === 0 &&
    p.supportPreference !== "none"
  ) || null;
}

export function getPeerMatchReason(participant, peer) {
  const barriers = participant.reportedBarriers || [];
  const peerText = `${peer.story || ""} ${peer.recoveryNote || ""}`.toLowerCase();

  if (peer.recoveryNote) {
    for (const b of barriers) {
      if (peerText.includes(b)) {
        return `${peer.firstName} faced ${b} challenges in week ${peer.currentWeek - 2} and recovered — a strong match for peer support.`;
      }
    }
    return `${peer.firstName} navigated a tough stretch earlier in the program and is on track to graduate.`;
  }
  return `${peer.firstName} is in week ${peer.currentWeek} with perfect attendance and available for peer support.`;
}
