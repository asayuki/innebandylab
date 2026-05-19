import { mount } from '@vue/test-utils';
import Logo from './Logo.vue';

describe('Logo.vue', () => {
  it('renders the logo image', () => {
    const wrapper = mount(Logo);
    expect(wrapper.find('.logo').exists()).toBe(true);
    expect(wrapper.text()).toBe('Innebandylab');
  });
});