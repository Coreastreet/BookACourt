# redis_host = Rails.application.secrets.redis && Rails.application.secrets.redis['host'] || 'localhost'
# redis_port = Rails.application.secrets.redis && Rails.application.secrets.redis['port'] || 6379

# The constant below will represent ONE connection, present globally in models, controllers, views etc for the instance. No need to do Redis.new everytime

Redis.current = Redis.new(host: "localhost")
$redis = Redis.current
