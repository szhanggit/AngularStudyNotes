component_library_path="Shared-Library/dist/component-library/"
authorization_library_path="Shared-Library/dist/authorization-library/"

new_component=$(npm pack --dry-run "../${component_library_path}" | tail -n1)
new_auth=$(npm pack --dry-run "../${authorization_library_path}" | tail -n1)


npm i --force
npm i "../${component_library_path}${new_component}" --force
npm i "../${authorization_library_path}${new_auth}" --force

