import { mount } from '@vue/test-utils';
import Logo from './Logo.vue';

describe('Logo.vue', () => {
  it('renders the logo image', () => {
    const wrapper = mount(Logo);
    expect(wrapper.find('.logo').exists()).toBe(true);
    expect(wrapper.text()).toBe('InnebandyLab');
  });

  it('applies the correct size class when size prop is provided', () => {
    const wrapper = mount(Logo, {
      props: {
        size: '--t-h1',
      },
    });
    expect(wrapper.element.style.fontSize).toBe('var(--t-h1)');
  });

  it('does not apply size class when size prop is not provided', () => {
    const wrapper = mount(Logo);
    expect(wrapper.element.style.fontSize).toBe('');
  });
});