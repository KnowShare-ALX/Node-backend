


curl -XGET 0.0.0.0:5000/files/64fead533cac60485f751d97 -H "X-Token: ad39027a-351c-4563-bace-cd7e60e786b6" ; echo ""

curl -XPOST 0.0.0.0:5000/files -H "X-Token: ad39027a-351c-4563-bace-cd7e60e786b6" -H "Content-Type: application/json" -d '{ "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==" }' ; echo ""

curl -XGET 0.0.0.0:5000/files?parentId=0&page=0 -H "X-Token: ad39027a-351c-4563-bace-cd7e60e786b6f" ; echo ""