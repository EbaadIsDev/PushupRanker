exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  try {
    // Parse the count parameter
    const params = new URLSearchParams(event.queryStringParameters);
    const count = parseInt(params.get('count') || event.queryStringParameters.count || '0');
    
    if (isNaN(count) || count < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Invalid pushup count. Please provide a positive number."
        })
      };
    }
    
    // Basic rank calculation logic
    let tier = "bronze";
    let level = 1;
    let progress = 0;
    let nextThreshold = 0;
    
    if (count < 10) {
      // Beginner: 0-9 pushups
      tier = "bronze";
      level = 1;
      progress = count * 10; // 0-90% within Bronze level 1
      nextThreshold = 10;
    } else if (count < 25) {
      // Bronze level 2: 10-24 pushups
      tier = "bronze";
      level = 2;
      progress = (count - 10) * (100 / 15); // Convert to percentage within this level
      nextThreshold = 25;
    } else if (count < 50) {
      // Bronze level 3: 25-49 pushups
      tier = "bronze";
      level = 3;
      progress = (count - 25) * (100 / 25);
      nextThreshold = 50;
    } else if (count < 75) {
      // Silver level 1: 50-74 pushups
      tier = "silver";
      level = 1;
      progress = (count - 50) * (100 / 25);
      nextThreshold = 75;
    } else if (count < 100) {
      // Silver level 2: 75-99 pushups
      tier = "silver";
      level = 2;
      progress = (count - 75) * (100 / 25);
      nextThreshold = 100;
    } else if (count < 150) {
      // Gold level 1: 100-149 pushups
      tier = "gold";
      level = 1;
      progress = (count - 100) * (100 / 50);
      nextThreshold = 150;
    } else if (count < 200) {
      // Gold level 2: 150-199 pushups
      tier = "gold";
      level = 2;
      progress = (count - 150) * (100 / 50);
      nextThreshold = 200;
    } else if (count < 250) {
      // Platinum level 1: 200-249 pushups
      tier = "platinum";
      level = 1;
      progress = (count - 200) * (100 / 50);
      nextThreshold = 250;
    } else if (count < 300) {
      // Platinum level 2: 250-299 pushups
      tier = "platinum";
      level = 2;
      progress = (count - 250) * (100 / 50);
      nextThreshold = 300;
    } else {
      // Diamond tier: 300+ pushups
      tier = "diamond";
      level = Math.min(5, 1 + Math.floor((count - 300) / 100));
      progress = ((count - 300) % 100) * (100 / 100);
      nextThreshold = 300 + (level * 100);
      
      // Cap at Diamond level 5
      if (level === 5) {
        progress = 100;
        nextThreshold = 0;
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        tier,
        level,
        progress: Math.min(100, Math.floor(progress)),
        nextThreshold
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: "Internal server error" 
      })
    };
  }
};