# ssh -A admin@d2m.io 'sudo bash ' < deploy.sh
GIT_REPO="https://github.com/dmillar/donniemillar.com.git"
BASE_DIR="/var/www/donniemillar.com"

cd $BASE_DIR

rm -rf tmp
git clone $GIT_REPO tmp

recent_commits=($(git -C ./tmp log --pretty=format:"%h" -n 5))

cp $BASE_DIR/.env ./tmp/.env
cp -f ./${recent_commits[1]}/.env ./tmp/.env
latest_commit=${recent_commits[0]}

rm -rf $latest_commit
mv tmp $latest_commit

echo "Installing dependencies..."
cd $latest_commit
npm install
npm run build

cd $BASE_DIR
ln -sfn $latest_commit current
ln -sfn $BASE_DIR/logs $BASE_DIR/current/logs

chown -R appuser:appuser $latest_commit current logs
chmod -R 775 $latest_commit logs

rm -rf ${recent_commits[-1]}
service donniemillar.com restart

echo "Waiting for service to restart..."
sleep 5

status_code=$(curl -o /dev/null --silent --head --write-out '%{http_code}\n' https://donniemillar.com)

if [ $status_code -eq 200 ]
then
  echo "Deploy successful"
else
  echo "Deploy failed"
fi