namespace :deploy do

  task :link_shared_directories do
    puts "This is the shared path #{shared_path}"
    run "ln -s #{shared_path}/public/system/logos #{release_path}/public/logos"
  end
  after "deploy:updated", :link_shared_directories

end
