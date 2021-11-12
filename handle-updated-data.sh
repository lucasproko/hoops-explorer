export NEW_DATE=$(date +"%s")
echo "Update to [$NEW_DATE]"
# Update env for local dev:
sed -i "-backup" s/MEN_CURR_UPDATE=.*/MEN_CURR_UPDATE=$NEW_DATE/ .env
sed -i "-backup" s/WOMEN_CURR_UPDATE=.*/WOMEN_CURR_UPDATE=$NEW_DATE/ .env
echo "Now call 'source .env'"
# Update the env variables in vercel:
echo "y" | vercel secrets rm men-curr-update
vercel secrets add men-curr-update $NEW_DATE
echo "y" | vercel secrets rm women-curr-update
vercel secrets add women-curr-update $NEW_DATE
# Redeploy app (so that server side cache gets the new data)
if [ "$REDEPLOY_HOOK_ID" == "--skip" ]; then
  echo "Skip redeploy"
elif [ ! -z "$REDEPLOY_HOOK_ID" ]; then
  echo "Always deploy, using hook:"
  curl https://api.vercel.com/v1/integrations/deploy/$REDEPLOY_HOOK_ID
else
  # Before I new about hooks, I was redeploying from source:
  if git status | grep -q "nothing to commit, working tree clean"  && \
      git status | grep -q "Your branch is up to date with 'origin/master'."; then
    echo "Deploy to prod:"
    vercel --prod
  else
    echo "Unclean working directory, you will have to hand deploy to prod: 'vercel --prod'"
  fi  
fi
