require 'rest-client'

# response = RestClient.post "https://www.weball.com.au/api/v1/sports_centres/1/bookings", {"Token": "ojYhT7iWiCwgTgGVTuQdrXsvHzTb%2BNoe"}, {content_type: "application/x-www-form-urlencoded"}



response = RestClient.post "https://poliapi.apac.paywithpoli.com/api/v2/Transaction/Initiate", {Amount: "1.2", CurrencyCode: "AUD", MerchantReference:"CustomerRef12345",
    MerchantHomepageURL:"https://www.mycompany.com",
    SuccessURL:"https://www.weball.com.au/api/v1/sports_centres/1/bookings",
    FailureURL:"https://www.mycompany.com/Failure",
    CancellationURL:"https://www.mycompany.com/Cancelled",
    NotificationURL:"https://www.mycompany.com/nudge"},
    {Authorization: "Basic UzYxMDQ2ODk6RWQ2QCRNYjM0Z14="}

puts response.code
puts response.headers
puts response.body
