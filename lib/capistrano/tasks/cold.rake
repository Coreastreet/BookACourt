namespace :deploy do

  desc "deploy app for the first time (expects pre-created but empty DB)"
  task :cold do
    before 'deploy:migrate', 'deploy:initdb'
    invoke 'deploy'
  end

  desc "initialize a brand-new database (db:schema:load, db:seed)"
  task :initdb do
    on primary :web do |host|
      within release_path do
        if test(:psql, 'portal_production -c "SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' AND table_type=\'BASE TABLE\';"|grep schema_migrations')
          puts '*** THE PRODUCTION DATABASE IS ALREADY INITIALIZED, YOU IDIOT! ***'
        else
          execute 'yarn install --check-files --skip-integrity-check'
          execute :rake, 'db:schema:load'
          execute :rake, 'db:seed'
        end
      end
    end
  end

end
