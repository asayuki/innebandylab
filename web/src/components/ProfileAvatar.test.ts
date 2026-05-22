import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/stores/auth';
import ProfileAvatar from './ProfileAvatar.vue';

describe('ProfileAvatar.vue', () => {
  it('renders the button with user initials', () => {
    const wrapper = mount(ProfileAvatar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: {
                user: { name: 'Jane Doe' },
              },
            },
          }),
        ],
      },
    });

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('JD');
    expect(button.attributes('title')).toBe('Jane Doe');
  });

  it('handles missing user gracefully', () => {
    const wrapper = mount(ProfileAvatar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { user: null },
            },
          }),
        ],
      },
    });

    expect(wrapper.find('button').text()).toBe('');
  });
});