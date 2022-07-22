import { Ability } from '@casl/ability';
const initialAbility = [
    {
      action: 'read',
      subject: 'Auth'
    }
];

//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this
let userData = null;
try {
  userData = JSON.parse(localStorage.getItem('userData'));
} catch (err) {
  console.log(err);
}

const existingAbility = userData ? userData.ability : null;

export const ability =  new Ability(existingAbility || initialAbility);

const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    defaultPath: '/login',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12
};

export default config;
