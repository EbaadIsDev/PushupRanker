exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Basic validation
    if (!data.count || data.count < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          message: "Please enter at least 1 pushup" 
        })
      };
    }

    // Create a record with timestamp
    const record = {
      count: data.count,
      difficultyLevel: data.difficultyLevel || "standard",
      timestamp: Date.now(),
      id: Math.floor(Math.random() * 1000000)
    };

    // In a real implementation, you would save this to a database
    // For now, we'll just return the record
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message: "Pushup record created successfully",
        record
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