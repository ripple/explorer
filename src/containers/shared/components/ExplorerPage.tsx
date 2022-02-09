import { Component } from 'react';

interface Props {
  match: {
    path: string;
    params: {
      url: string;
    };
  };
  updateContext: (rippledUrl: string, urlLinke: string) => null;
}

class ExplorerPage extends Component {
  constructor(props: Props) {
    super(props);
    // eslint-disable-next-line react/prop-types -- TS here instead
    const { updateContext, match } = props;
    // eslint-disable-next-line react/prop-types -- TS here instead
    const rippledUrl = match.params.url;
    const urlLink = rippledUrl ? `/${rippledUrl}` : '';
    updateContext(rippledUrl, urlLink);
  }
}

export default ExplorerPage;
