class api::UsersController < ApplicationController

  def update
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render partial: 'api/session/user_session', locals: {user: @user}
    else
      render "failed"
    end
  end

  private
  def user_params
    params.require(:user).permit(:username, :password)
  end

end
