import { mount } from '@vue/test-utils';
import Logo from './Logo.vue';

describe('Logo.vue', () => {
  it('renders the logo image', () => {
    const wrapper = mount(Logo);
    expect(wrapper.find('.logo').exists()).toBe(true);
    expect(wrapper.text()).toBe('Innebandylab');
  });

  it('applies the correct size class when size prop is provided', () => {
    const wrapper = mount(Logo, {
      props: {
        size: 'large',
      },
    });
    expect(wrapper.classes()).toContain('text-large');
  });

  it('does not apply size class when size prop is not provided', () => {
    const wrapper = mount(Logo);
    expect(wrapper.classes()).not.toContain('text-small');
    expect(wrapper.classes()).not.toContain('text-medium');
    expect(wrapper.classes()).not.toContain('text-large');
    expect(wrapper.classes()).not.toContain('text-xlarge');
  });
});