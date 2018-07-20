Service usage: https://petria-puhelinluettelo-3-21.now.sh

Deployment instructions:
- Define UNIQUE index for people collection name field in mLab database admin UI.
- Define environment variables: 'DbUserPuhLuet' and 'DbPasswordPuhLuet'
- if you want to run production version and database, set NODE_ENV=production
- Set now secrets: 'dbuserpuhluet-key' and 'dbpasswordpuhluet-key'
