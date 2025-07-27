#!/bin/bash
echo "Applying SGE Media Module migration..."
curl -X POST https://navimpact-api.onrender.com/api/v1/debug/apply-migration
echo "Migration applied!"

