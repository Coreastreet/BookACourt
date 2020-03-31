
add justin
add justin sudo # never use deploy; name of user must match owner of the database.
exit
# add ssh key to local machine.
# local machine
ssh-keygen -t rsa
ssh-copy-id root@(ip)
ssh-copy-id deploy@(ip)

sudo apt-get update
sudo apt-get install lubuntu-core --no-install-recommends
reboot

curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
# Adding Yarn repository
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo add-apt-repository ppa:chris-lea/redis-server
# Refresh our packages list with the new repositories
sudo apt-get update
# Install our dependencies for compiiling Ruby along with Node.js and Yarn
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev
libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common
libffi-dev dirmngr gnupg apt-transport-https ca-certificates redis-server redis-tools nodejs yarn

git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
git clone https://github.com/rbenv/rbenv-vars.git ~/.rbenv/plugins/rbenv-vars

run the following command seperately or the rbenv command will not be found.
exec $SHELL
# put the following in a seperate shell script.
# do not attempt to install a ruby version different to the one used when creating your rails app.
rbenv install 2.7.0
rbenv global 2.7.0
ruby -v

copy the config for the nginx server from gorails exactly.
# bundler already installed by default

# to migrate the environment variables including secret_key_base
# avoid setting env variables via exports.
#env
#sudo nano /etc/environment
#export ENV="CODE"
#logout
#login
#env
reboot may be need before the following line.
sudo dpkg --configure -a
sudo apt-get install -y nginx-extras libnginx-mod-http-passenger

must use 127.0.0.1 instead of localhost when connecting to database.

touch in shared/config/master.key or set ENV variable for 'master.key' to enable access.
in ENV["RAILS_MASTER_KEY"]

do not use the old config, follow instructions for a fresh capistrano install.
chown of app to justin/local user to allow mkdir
rbenv var command will check if env variables are working; if not reinstall by deleting
and running git clone https://github.com/rbenv/rbenv-vars.git $(rbenv root)/plugins/rbenv-vars


database
deploy cold uncomment the initdb method and
convert the pg_hba.conf for local to md5

set cap-postgres to ask for password
manually create the database.yml file for auth in the shared/config directory
add in the adapter and all other essential keys.

make sure that passenger friendly error pages is on in the server block

after running deploy (no cold and removing migrations)
the database should be loaded.
then run the rails credentials:edit and update the master key locally.
