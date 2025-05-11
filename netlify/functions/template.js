exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      totalPushups: 0,
      maxSet: 0,
      currentRankTier: 'bronze',
      currentRankLevel: 1,
      currentProgress: 0,
      history: [],
      settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        animationsEnabled: true,
        darkModeEnabled: true
      }
    })
  };
};