import { GamebetFrontendPage } from './app.po';

describe('gamebet-frontend App', () => {
  let page: GamebetFrontendPage;

  beforeEach(() => {
    page = new GamebetFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
